import { combineReducers } from 'redux';
import filter from './filter';
import sort from './sort';
import pagination from './pagination';

export default (resource) => combineReducers({
    filter: filter(resource),
    sort: sort(resource),
    pagination: pagination(resource),
});
