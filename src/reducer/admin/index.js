import { combineReducers } from 'redux';
import resources from './resource';
import loading from './loading';
import notification from './notification';
import references from './references';
import saving from './saving';
import ui from './ui';

export default combineReducers({
    resources,
    loading,
    notification,
    references,
    saving,
    ui,
});
