import { combineReducers } from 'redux';
import data from './data/reducer';
import sort from './sort/reducer';
import pagination from './pagination/reducer';

export default (resource, mapper, idAccessor) => combineReducers({
    sort: sort(resource),
    pagination: pagination(resource),
    data: data(resource, mapper, idAccessor),
});
