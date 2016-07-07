import { CRUD_FETCH_LIST_SUCCESS } from './actions';
import { CRUD_FETCH_RECORD_SUCCESS } from '../../detail/actions';

export default (resource, mapper = x => x, idAccessor = x => x.id) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS: {
        const byId = {};
        payload.json.forEach(r => {
            byId[idAccessor(r)] = mapper(r);
        });
        return byId;
    }
    case CRUD_FETCH_RECORD_SUCCESS:
        return { ...previousState, [idAccessor(payload.json)]: payload.json };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
