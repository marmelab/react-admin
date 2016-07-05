import { CRUD_FETCH_LIST_SUCCESS } from './actions';

export default (resource, mapper = x => x) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS: {
        const byId = {};
        payload.response.forEach(r => {
            byId[r.id] = mapper(r);
        });
        return byId;
    }
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
