import { combineReducers } from 'redux';
import oneToMany from './oneToMany';
import possibleValues from './possibleValues';

export default combineReducers({
    oneToMany,
    possibleValues,
});
