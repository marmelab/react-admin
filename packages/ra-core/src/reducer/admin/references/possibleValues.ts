import { Reducer } from 'redux';
import {
    CRUD_GET_MATCHING_SUCCESS,
    CrudGetMatchingSuccessAction,
    CRUD_GET_MATCHING_FAILURE,
    CrudGetMatchingFailureAction,
} from '../../../actions/dataActions';
import { Identifier } from '../../../types';

const initialState = {};

export interface PossibleValuesState {
    [relatedTo: string]: { error?: string | object } | Identifier[];
}

type ActionTypes =
    | CrudGetMatchingSuccessAction
    | CrudGetMatchingFailureAction
    | { type: 'OTHER_ACTION' };

const possibleValuesreducer: Reducer<PossibleValuesState> = (
    previousState = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case CRUD_GET_MATCHING_SUCCESS:
            return {
                ...previousState,
                [action.meta.relatedTo]: action.payload.data.map(
                    record => record.id
                ),
            };
        case CRUD_GET_MATCHING_FAILURE:
            return {
                ...previousState,
                [action.meta.relatedTo]: { error: action.error },
            };
        default:
            return previousState;
    }
};

export const getPossibleReferenceValues = (state, props) => {
    return state[props.referenceSource(props.resource, props.source)];
};

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
    const possibleValuesList = Array.from(possibleValues);
    selectedIds.forEach(
        id =>
            possibleValuesList.some(value => value === id) ||
            possibleValuesList.unshift(id)
    );
    return (
        possibleValuesList
            // @ts-ignore
            .map(id => referenceState.data[id])
            .filter(r => typeof r !== 'undefined')
    );
};

export default possibleValuesreducer;
