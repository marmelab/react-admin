import { Reducer } from 'redux';
import { FETCH_END } from '../../../../actions';
import { GET_LIST } from '../../../../core';

interface ValidityRegistry {
    [key: string]: Date;
}

const initialState = {};

const validityReducer: Reducer<ValidityRegistry> = (
    previousState = initialState,
    { payload, requestPayload, meta }
) => {
    if (
        !meta ||
        !meta.fetchResponse ||
        meta.fetchStatus !== FETCH_END ||
        meta.fromCache === true ||
        meta.fetchResponse !== GET_LIST
    ) {
        return previousState;
    }
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
};

export default validityReducer;
