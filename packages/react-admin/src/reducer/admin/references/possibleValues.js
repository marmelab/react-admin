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
    referenceState,
    possibleValues,
    selectedIds = []
) => {
    possibleValues = possibleValues ? Array.from(possibleValues) : [];
    selectedIds.forEach(
        id =>
            possibleValues.some(value => value == id) ||
            possibleValues.unshift(id)
    );
    return possibleValues
        .map(id => referenceState.data[id])
        .filter(r => typeof r !== 'undefined');
};
