import { combineReducers } from 'redux';
import oneToMany from './oneToMany';
import possibleValues, {
    getPossibleReferences as pvGetPossibleReferences,
    getPossibleReferenceValues as pvGetPossibleReferenceValues,
} from './possibleValues';

export default combineReducers({
    oneToMany,
    possibleValues,
});

export const getPossibleReferenceValues = (state, props) => pvGetPossibleReferenceValues(state.possibleValues, props);

export const getPossibleReferences = pvGetPossibleReferences;
