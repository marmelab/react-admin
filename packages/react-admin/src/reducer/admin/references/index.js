import { combineReducers } from 'redux';
import oneToMany from './oneToMany';
import possibleValues from './possibleValues';

export default combineReducers({
    oneToMany,
    possibleValues,
});

export const getReferenceResource = (state, props) => state[props.reference];

export const getPossibleReferenceValues = (state, props) =>
    state.possibleValues[props.referenceSource(props.resource, props.source)];

export { getPossibleReferences } from './possibleValues';
