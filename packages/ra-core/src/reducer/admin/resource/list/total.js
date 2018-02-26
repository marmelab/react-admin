import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_DELETE,
    CRUD_DELETE_MANY,
} from '../../../../actions/dataActions';

export default resource => (previousState = 0, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    if (type === CRUD_GET_LIST_SUCCESS) {
        return payload.total;
    }
    if (type === CRUD_DELETE) {
        return previousState - 1;
    }
    if (type === CRUD_DELETE_MANY) {
        return previousState - payload.ids.length;
    }
    return previousState;
};
