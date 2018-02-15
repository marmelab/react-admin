import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';
import selectedIds from './selectedIds';
import total from './total';

export default combineReducers({
    ids,
    params,
    selectedIds,
    total,
});
