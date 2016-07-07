import { CRUD_FETCH_LIST_SUCCESS } from './actions';
import { CRUD_FETCH_RECORD_SUCCESS } from '../../detail/actions';

export default (resource, idAccessor = x => x.id) => (previousState = [], { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS:
        return payload.json.map(idAccessor);
    case CRUD_FETCH_RECORD_SUCCESS: {
        const id = idAccessor(payload.json);
        return previousState.indexOf(id) === -1 ? [...previousState, id] : previousState;
    }
    default:
        return previousState;
    }
};

export const getIds = (state) => state;
