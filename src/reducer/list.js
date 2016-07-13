import { combineReducers } from 'redux';
import listData from './listData';
import sort from './sort';
import pagination from './pagination';

export default (resource) => combineReducers({
    ids: listData(resource),
    params: combineReducers({
        sort: sort(resource),
        pagination: pagination(resource),
    }),
});
