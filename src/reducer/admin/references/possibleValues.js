import { CRUD_GET_MATCHING_SUCCESS } from '../../../actions/dataActions';

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

export const getPossibleReferences = (
    state,
    referenceSource,
    reference,
    selectedIds = []
) => {
    const possibleValues = state.admin.references.possibleValues[
        referenceSource
    ]
        ? Array.from(state.admin.references.possibleValues[referenceSource])
        : [];
    selectedIds.forEach(
        id =>
            possibleValues.some(value => value == id) ||
            possibleValues.unshift(id)
    );

    return possibleValues
        .map(id => state.admin.resources[reference].data[id])
        .filter(r => typeof r !== 'undefined');
};
