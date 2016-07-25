import { CRUD_GET_LIST_SUCCESS } from '../../../actions/dataActions';

export default (resource) => (previousState = [], { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_LIST_SUCCESS:
        return payload.data.map(record => record.id);
    default:
        return previousState;
    }
};

export const getIds = (state) => state;
