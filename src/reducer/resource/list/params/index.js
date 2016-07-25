import { combineReducers } from 'redux';
import sort from './sort';
import pagination from './pagination';

export default (resource) => combineReducers({
    sort: sort(resource),
    pagination: pagination(resource),
});
