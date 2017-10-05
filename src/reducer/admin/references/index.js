import { combineReducers } from 'redux';
import oneToMany, { getRelatedTo } from './oneToMany';
import possibleValues from './possibleValues';

export default combineReducers({
    oneToMany,
    possibleValues,
});

export const getPossibleValues = state => state.possibleValues;
export const getOneToMany = state => state.oneToMany;
export const getIdsRelatedTo = (state, props) =>
    getRelatedTo(getOneToMany(state), props);
