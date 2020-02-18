import { Reducer } from 'redux';
import { FETCH_END, REFRESH_VIEW } from '../../../../actions';
import { GET_LIST, CREATE } from '../../../../core';

interface ValidityRegistry {
    [key: string]: Date;
}

const initialState = {};

const validityReducer: Reducer<ValidityRegistry> = (
    previousState = initialState,
    { type, payload, requestPayload, meta }
) => {
    if (type === REFRESH_VIEW) {
        return initialState;
    }
    if (
        !meta ||
        !meta.fetchResponse ||
        meta.fetchStatus !== FETCH_END ||
        meta.fromCache === true
    ) {
        return previousState;
    }
    switch (meta.fetchResponse) {
        case GET_LIST: {
            if (payload.validUntil) {
                // store the validity date
                return {
                    ...previousState,
                    [JSON.stringify(requestPayload)]: payload.validUntil,
                };
            } else {
                // remove the validity date
                const {
                    [JSON.stringify(requestPayload)]: value,
                    ...rest
                } = previousState;
                return rest;
            }
        }
        case CREATE:
            // force refresh of all lists because we don't know where the
            // new record will appear in the list
            return initialState;
        default:
            return previousState;
    }
};

export default validityReducer;
