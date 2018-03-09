import { CRUD_GET_LIST_SUCCESS } from '../../../../actions/dataActions';
export default resource => (previousState = false, { type, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
        case CRUD_GET_LIST_SUCCESS:
            return true;
        default:
            return previousState;
    }
};
