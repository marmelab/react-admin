import { CRUD_FETCH_LIST_SUCCESS } from '../list/data/actions';
import { CRUD_FETCH_RECORD_SUCCESS } from '../detail/actions';

export default (resource) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS: {
        const byId = {};
        payload.json.forEach(r => {
            byId[r.id] = r;
        });
        return byId;
    }
    case CRUD_FETCH_RECORD_SUCCESS:
        return { ...previousState, [payload.json.id]: payload.json };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
