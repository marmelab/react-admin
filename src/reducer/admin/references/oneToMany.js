import { CRUD_GET_MANY_REFERENCE_SUCCESS } from '../../../actions/dataActions';

const initialState = {};

export default (previousState = initialState, { type, payload, meta }) => {
    switch (type) {
    case CRUD_GET_MANY_REFERENCE_SUCCESS:
        return {
            ...previousState,
            [meta.relatedTo]: payload.data.map(record => record.id),
        };
    default:
        return previousState;
    }
};

export const getIdsRelatedTo = (state) => (relatedTo) => state[relatedTo];

export const nameRelatedTo = (reference, id, resource, target) => `${resource}_${reference}@${target}_${id}`;
