import { CRUD_GET_MANY_REFERENCE_SUCCESS } from '../../actions/dataActions';

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

export const getIds = (state, relatedTo) => state.admin.references.oneToMany[relatedTo];

export const getReferences = (state, reference, relatedTo) => {
    const ids = getIds(state, relatedTo);
    if (typeof ids === 'undefined') return undefined;
    return ids
        .map(id => state.admin[reference].data[id])
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, record) => {
            prev[record.id] = record; // eslint-disable-line no-param-reassign
            return prev;
        }, {});
};

export const getReferencesByIds = (state, reference, ids) => {
    if (ids.length === 0) return {};
    return ids
        .map(id => state.admin[reference].data[id])
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, record) => {
            prev[record.id] = record; // eslint-disable-line no-param-reassign
            return prev;
        }, {});
};

export const nameRelatedTo = (reference, id, resource, target) => `${resource}_${reference}@${target}_${id}`;
