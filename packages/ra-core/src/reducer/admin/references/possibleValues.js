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

export const getPossibleReferenceValues = (state, props) =>
    state[props.referenceSource(props.resource, props.source)];

export const getPossibleReferences = (
    referenceState,
    possibleValues,
    selectedIds = []
) => {
    if (!possibleValues) {
        return null;
    }

    if (possibleValues.error) {
        return possibleValues;
    }
    possibleValues = Array.from(possibleValues);
    selectedIds.forEach(
        id =>
            possibleValues.some(value => value == id) ||
            possibleValues.unshift(id)
    );
    return possibleValues
        .map(id => referenceState.data[id])
        .filter(r => typeof r !== 'undefined');
};
