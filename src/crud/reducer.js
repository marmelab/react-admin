import { combineReducers } from 'redux';
import data from '../data/reducer';
import list from '../list/reducer';

export default (resource) => combineReducers({
    data: data(resource),
    list: list(resource),
});
