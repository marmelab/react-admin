import { combineReducers } from 'redux';
import oneToMany from './oneToMany';
import possibleValues from './possibleValues';

export default combineReducers({
    oneToMany,
    possibleValues,
});

export const getReferenceResource = (state, props) => state[props.reference];

export const getPossibleValues = (state, referenceSource) =>
    state.possibleValues[referenceSource];

export { getPossibleReferences } from './possibleValues';
