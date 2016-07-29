import { CRUD_GET_MATCHING_SUCCESS } from '../../actions/dataActions';

const initialState = {
};

export default (resource) => (previousState = initialState, { type, payload, meta }) => {
    if (!meta || meta.relatedTo !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_MATCHING_SUCCESS:
        return {
            ...previousState,
            [meta.resource]: payload.map(record => record.id),
        };
    default:
        return previousState;
    }
};
