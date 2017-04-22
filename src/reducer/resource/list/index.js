import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';
import total from './total';
import version from './version';

export default resource => combineReducers({
    ids: ids(resource),
    params: params(resource),
    total: total(resource),
    version: version(resource),
});
