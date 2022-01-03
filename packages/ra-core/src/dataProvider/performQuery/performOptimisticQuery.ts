import validateResponseFormat from '../validateResponseFormat';
import getFetchType from '../getFetchType';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../../actions/undoActions';
import {
    FETCH_END,
    FETCH_ERROR,
    FETCH_START,
} from '../../actions/fetchActions';
import { replayStackedCalls } from './stackedCalls';
import { QueryFunctionParams } from './QueryFunctionParams';

/**
 * In optimistic mode, the useDataProvider hook dispatches an optimistic action
 * and executes the success side effects right away. Then it immediately calls
 * the dataProvider.
 *
 * We call that "optimistic" because the hook returns a resolved Promise
 * immediately (although it has an empty value). That only works if the
 * caller reads the result from the Redux store, not from the Promise.
 */
export const performOptimisticQuery = ({
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
    setTimeout(() => {
        dispatch(stopOptimisticMode());
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
                    replayStackedCalls();
                })
                .catch(error => {
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
