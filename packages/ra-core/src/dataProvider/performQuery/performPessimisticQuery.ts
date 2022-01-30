import validateResponseFormat from '../validateResponseFormat';
import getFetchType from '../getFetchType';
import {
    FETCH_END,
    FETCH_ERROR,
    FETCH_START,
} from '../../actions/fetchActions';
import { QueryFunctionParams } from './QueryFunctionParams';

/**
 * In pessimistic mode, the useDataProvider hook calls the dataProvider. When a
 * successful response arrives, the hook dispatches a SUCCESS action, executes
 * success side effects and returns the response. If the response is an error,
 * the hook dispatches a FAILURE action, executes failure side effects, and
 * throws an error.
 */
export const performPessimisticQuery = ({
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
}: QueryFunctionParams): Promise<any> => {
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({
        type: `${action}_LOADING`,
        payload,
        meta: { resource, ...rest },
    });
    dispatch({ type: FETCH_START });

    try {
        return dataProvider[type]
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
                onSuccess && onSuccess(response);
                return response;
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
                    throw error;
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
};
