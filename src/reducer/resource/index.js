import { combineReducers } from 'redux';
import data from './data';
import list from './list';
import detail from './detail';

export default (resource) => combineReducers({
    data: data(resource),
    list: list(resource),
    detail: detail(resource),
});
