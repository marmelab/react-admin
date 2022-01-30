import validateResponseFormat from '../validateResponseFormat';
import getFetchType from '../getFetchType';
import undoableEventEmitter from '../undoableEventEmitter';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../../actions/undoActions';
import { showNotification } from '../../actions/notificationActions';
import { refreshView } from '../../actions/uiActions';
import {
    FETCH_END,
    FETCH_ERROR,
    FETCH_START,
} from '../../actions/fetchActions';
import { replayStackedCalls } from './stackedCalls';
import { QueryFunctionParams } from './QueryFunctionParams';

/**
 * In undoable mode, the hook dispatches an optimistic action and executes
 * the success side effects right away. Then it waits for a few seconds to
 * actually call the dataProvider - unless the user dispatches an Undo action.
 *
 * We call that "optimistic" because the hook returns a resolved Promise
 * immediately (although it has an empty value). That only works if the
 * caller reads the result from the Redux store, not from the Promise.
 */
export const performUndoableQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    onFailure,
    dataProvider,
    dispatch,
    logoutIfAccessDenied,
    allArguments,
}: QueryFunctionParams): Promise<{}> => {
    dispatch(startOptimisticMode());
    if (window) {
        window.addEventListener('beforeunload', warnBeforeClosingWindow, {
            capture: true,
        });
    }
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_OPTIMISTIC`,
        payload,
        meta: {
            resource,
            fetch: getFetchType(type),
            optimistic: true,
        },
    });
    onSuccess && onSuccess({});
    undoableEventEmitter.once('end', ({ isUndo }) => {
        dispatch(stopOptimisticMode());
        if (isUndo) {
            dispatch(showNotification('ra.notification.canceled'));
            dispatch(refreshView());
            if (window) {
                window.removeEventListener(
                    'beforeunload',
                    warnBeforeClosingWindow,
                    {
                        capture: true,
                    }
                );
            }
            return;
        }
        dispatch({
            type: `${action}_LOADING`,
            payload,
            meta: { resource, ...rest },
        });
        dispatch({ type: FETCH_START });
        try {
            dataProvider[type]
                .apply(
                    dataProvider,
                    typeof resource !== 'undefined'
                        ? [resource, payload]
                        : allArguments
                )
                .then(response => {
                    if (process.env.NODE_ENV !== 'production') {
                        validateResponseFormat(response, type);
                    }
                    dispatch({
                        type: `${action}_SUCCESS`,
                        payload: response,
                        requestPayload: payload,
                        meta: {
                            ...rest,
                            resource,
                            fetchResponse: getFetchType(type),
                            fetchStatus: FETCH_END,
                        },
                    });
                    dispatch({ type: FETCH_END });
                    if (window) {
                        window.removeEventListener(
                            'beforeunload',
                            warnBeforeClosingWindow,
                            {
                                capture: true,
                            }
                        );
                    }
                    replayStackedCalls();
                })
                .catch(error => {
                    if (window) {
                        window.removeEventListener(
                            'beforeunload',
                            warnBeforeClosingWindow,
                            {
                                capture: true,
                            }
                        );
                    }
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                    return logoutIfAccessDenied(error).then(loggedOut => {
                        if (loggedOut) {
                            dispatch({ type: FETCH_END });
                            return;
                        }
                        dispatch({
                            type: `${action}_FAILURE`,
                            error: error.message ? error.message : error,
                            payload: error.body ? error.body : null,
                            requestPayload: payload,
                            meta: {
                                ...rest,
                                resource,
                                fetchResponse: getFetchType(type),
                                fetchStatus: FETCH_ERROR,
                            },
                        });
                        dispatch({ type: FETCH_ERROR, error });
                        onFailure && onFailure(error);
                    });
                });
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
            throw new Error(
                'The dataProvider threw an error. It should return a rejected Promise instead.'
            );
        }
    });
    return Promise.resolve({});
};

// event listener added as window.onbeforeunload when starting optimistic mode, and removed when it ends
const warnBeforeClosingWindow = event => {
    event.preventDefault(); // standard
    event.returnValue = ''; // Chrome
    return 'Your latest modifications are not yet sent to the server. Are you sure?'; // Old IE
};
