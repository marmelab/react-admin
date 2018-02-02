import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';
import total from './total';
import selection from './selection';

export default resource =>
    combineReducers({
        ids: ids(resource),
        params: params(resource),
        total: total(resource),
        selection: selection(resource),
    });
