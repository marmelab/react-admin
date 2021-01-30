import { getResultFromCache } from '../replyWithCache';
import getFetchType from '../getFetchType';
import { FETCH_END } from '../../actions/fetchActions';

export const answerWithCache = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    resourceState,
    dispatch,
}) => {
    dispatch({
        type: action,
        payload,
        meta: { resource, ...rest },
    });
    const response = getResultFromCache(type, payload, resourceState);
    dispatch({
        type: `${action}_SUCCESS`,
        payload: response,
        requestPayload: payload,
        meta: {
            ...rest,
            resource,
            fetchResponse: getFetchType(type),
            fetchStatus: FETCH_END,
            fromCache: true,
        },
    });
    onSuccess && onSuccess(response);
    return Promise.resolve(response);
};
