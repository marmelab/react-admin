import { CRUD_GET_LIST_SUCCESS, CRUD_DELETE_SUCCESS } from '../../../actions/dataActions';

export default resource => (previousState = [], { type, payload, requestPayload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_LIST_SUCCESS:
        return payload.data.map(record => record.id);
    case CRUD_DELETE_SUCCESS: {
        const index = previousState.findIndex(el => el == requestPayload.id); // eslint-disable-line eqeqeq
        if (index === -1) {
            return previousState;
        }
        return [...previousState.slice(0, index), ...previousState.slice(index + 1)];
    }
    default:
        return previousState;
    }
};

export const getIds = (state) => state;
