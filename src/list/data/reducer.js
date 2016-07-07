import { combineReducers } from 'redux';
import byId from './byId';
import allIds from './allIds';

export default (resource, mapper, idAccessor) => combineReducers({
    byId: byId(resource, mapper, idAccessor),
    allIds: allIds(resource, idAccessor),
});
