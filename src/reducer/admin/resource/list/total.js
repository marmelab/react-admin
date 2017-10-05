import { CRUD_GET_LIST_SUCCESS } from '../../../../actions/dataActions';

export const initialState = 0;

export default resource => (
    previousState = initialState,
    { type, payload, meta }
) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    if (type === CRUD_GET_LIST_SUCCESS) {
        return payload.total;
    }
    return previousState;
};
