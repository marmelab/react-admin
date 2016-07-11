import { combineReducers } from 'redux';
import data from './data/reducer';
import sort from './sort/reducer';
import pagination from './pagination/reducer';

export default (resource) => combineReducers({
    ids: data(resource),
    params: combineReducers({
        sort: sort(resource),
        pagination: pagination(resource),
    }),
});
