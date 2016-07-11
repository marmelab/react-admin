import { CRUD_FETCH_LIST_SUCCESS } from './actions';

export default (resource) => (previousState = [], { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS:
        return payload.json.map(r => r.id);
    default:
        return previousState;
    }
};

export const getIds = (state) => state;
