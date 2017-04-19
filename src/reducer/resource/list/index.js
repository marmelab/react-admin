import { combineReducers } from 'redux';
import ids from './ids';
import params from './params';
import total from './total';
import hiddenFields from './hiddenFields';

export default resource => combineReducers({
    ids: ids(resource),
    params: params(resource),
    total: total(resource),
    hiddenFields: hiddenFields(resource),
});
