import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_DELETE_OPTIMISTIC,
    CRUD_DELETE_MANY_OPTIMISTIC,
} from '../../../../actions/dataActions';

export default resource => (previousState = 0, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    if (type === CRUD_GET_LIST_SUCCESS) {
        return payload.total;
    }
    if (type === CRUD_DELETE_OPTIMISTIC) {
        return previousState - 1;
    }
    if (type === CRUD_DELETE_MANY_OPTIMISTIC) {
        return previousState - payload.ids.length;
    }
    return previousState;
};
