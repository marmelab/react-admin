import { combineReducers } from 'redux';
import data from './data';
import list from './list';

export default (resource) => combineReducers({
    data: data(resource),
    list: list(resource),
});
