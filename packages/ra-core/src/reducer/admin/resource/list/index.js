import { combineReducers } from 'redux';
import ids from './ids';
import loadedOnce from './loadedOnce';
import params from './params';
import selectedIds from './selectedIds';
import total from './total';

export default combineReducers({
    ids,
    loadedOnce,
    params,
    selectedIds,
    total,
});
