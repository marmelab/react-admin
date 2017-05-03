import { CRUD_GET_MATCHING_SUCCESS } from '../../actions/dataActions';

const initialState = {};

export default (previousState = initialState, { type, payload, meta }) => {
    switch (type) {
    case CRUD_GET_MATCHING_SUCCESS:
        return {
            ...previousState,
            [meta.relatedTo]: payload.data.map(record => record.id),
        };
    default:
        return previousState;
    }
};

export const getPossibleReferences = (state, referenceSource, reference, selectedId) => {
    if (!state.admin.references.possibleValues[referenceSource]) {
        return typeof selectedId === 'undefined' || !state.admin[reference].data[selectedId] ? [] : [state.admin[reference].data[selectedId]];
    }
    const possibleValues = state.admin.references.possibleValues[referenceSource];
    if (typeof selectedId !== 'undefined' && !possibleValues.includes(selectedId)) {
        possibleValues.unshift(selectedId);
    }
    return possibleValues
        .map(id => state.admin[reference].data[id])
        .filter(r => typeof r !== 'undefined');
};
