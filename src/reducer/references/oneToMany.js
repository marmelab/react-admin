import { CRUD_GET_MANY_REFERENCE_SUCCESS } from '../../actions/dataActions';

const initialState = {};

export default (previousState = initialState, { type, payload, meta }) => {
    switch (type) {
    case CRUD_GET_MANY_REFERENCE_SUCCESS:
        return {
            ...previousState,
            [meta.relatedTo]: payload.map(record => record.id),
        };
    default:
        return previousState;
    }
};

export const getReferences = (state, reference, relatedTo) => {
    if (typeof state.admin.references.oneToMany[relatedTo] === 'undefined') return undefined;
    return state.admin.references.oneToMany[relatedTo]
        .map(id => state.admin[reference].data[id])
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, record) => {
            prev[record.id] = record; // eslint-disable-line no-param-reassign
            return prev;
        }, {});
};

export const relatedTo = (reference, id, resource, target) => `${resource}_${reference}@${target}_${id}`;
