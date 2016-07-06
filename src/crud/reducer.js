import { combineReducers } from 'redux';
import data from '../list/data/reducer';
import list from '../list/reducer';

export default (resource, mapper, idAccessor) => combineReducers({
    data: data(resource, mapper, idAccessor),
    list: list(resource, mapper, idAccessor),
});
