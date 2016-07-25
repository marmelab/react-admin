import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';

export default (resource) => combineReducers({
    ids: ids(resource),
    params: params(resource),
});
