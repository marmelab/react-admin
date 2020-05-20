import { Reducer } from 'redux';
import { FETCH_END, REFRESH_VIEW } from '../../../../actions';
import {
    CREATE,
    DELETE,
    DELETE_MANY,
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    UPDATE,
    UPDATE_MANY,
} from '../../../../core';

type State = object;

const initialState = {};

const metaReducer: Reducer<State> = (
    previousState = initialState,
    { type, payload, meta }
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
    if (payload.meta) {
        switch (meta.fetchResponse) {
            case GET_LIST:
            case GET_ONE:
            case GET_MANY:
            case GET_MANY_REFERENCE:
            case UPDATE:
            case UPDATE_MANY:
            case CREATE:
            case DELETE:
            case DELETE_MANY:
                return payload.meta;
            default:
                return previousState;
        }
    }
};

export default metaReducer;
