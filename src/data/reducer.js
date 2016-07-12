import { CRUD_FETCH_SUCCESS, GET_MANY, GET_ONE, UPDATE } from './actions';

export default (resource) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource || type !== CRUD_FETCH_SUCCESS) {
        return previousState;
    }
    switch (payload.method) {
    case GET_MANY: {
        const byId = {};
        payload.data.forEach(record => {
            byId[record.id] = record;
        });
        return byId;
    }
    case GET_ONE:
    case UPDATE:
        return { ...previousState, [payload.data.id]: payload.data };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
