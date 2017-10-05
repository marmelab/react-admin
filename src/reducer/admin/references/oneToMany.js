import { CRUD_GET_MANY_REFERENCE_SUCCESS } from '../../../actions/dataActions';

export const initialState = {};

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

export const getRelatedTo = (state, { relatedTo }) => state[relatedTo] || [];

export const nameRelatedTo = (reference, id, resource, target, filter = {}) => {
    const keys = Object.keys(filter);
    if (!keys.length) {
        return `${resource}_${reference}@${target}_${id}`;
    }

    return `${resource}_${reference}@${target}_${id}?${keys
        .map(key => `${key}=${JSON.stringify(filter[key])}`)
        .join('&')}`;
};
