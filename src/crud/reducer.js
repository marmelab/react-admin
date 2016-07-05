import { combineReducers } from 'redux';
import list from '../list/reducer';

export default (resource, mapper, idAccessor) => combineReducers({
    list: list(resource, mapper, idAccessor),
});
