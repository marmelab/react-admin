import { FETCH_END } from 'react-admin';

export default (
    { type, payload: requestPayload, meta: { fetch: restType, ...meta } },
    payload
) => ({
    type: `${type}_SUCCESS`,
    payload,
    requestPayload,
    meta: { ...meta, fetchResponse: restType, fetchStatus: FETCH_END },
});
