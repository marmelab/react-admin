import {
    CRUD_GET_MATCHING_SUCCESS,
    CRUD_GET_MATCHING_FAILURE,
} from '../../../actions/dataActions';

const initialState = {};

export default (previousState = initialState, { type, payload, meta }) => {
    switch (type) {
        case CRUD_GET_MATCHING_SUCCESS:
            return {
                ...previousState,
                [meta.relatedTo]: payload.data.map(record => record.id),
            };
        case CRUD_GET_MATCHING_FAILURE:
            return {
                ...previousState,
                [meta.relatedTo]: { error: payload.error },
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
    if (!state.admin.references.possibleValues[referenceSource]) {
        return null;
    }

    if (state.admin.references.possibleValues[referenceSource].error) {
        return state.admin.references.possibleValues[referenceSource];
    }

    const possibleValues = Array.from(
        state.admin.references.possibleValues[referenceSource]
    );

    selectedIds.forEach(
        id =>
            possibleValues.some(value => value == id) ||
            possibleValues.unshift(id)
    );
    return possibleValues
        .map(id => state.admin.resources[reference].data[id])
        .filter(r => typeof r !== 'undefined');
};
