import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';
import selectedIds from './selectedIds';
import total from './total';

export default resource =>
    combineReducers({
        ids: ids(resource),
        params: params(resource),
        selectedIds,
        total: total(resource),
    });
