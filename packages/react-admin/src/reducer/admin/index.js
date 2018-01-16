import { combineReducers } from 'redux';
import resources, { getResources as innerGetResources } from './resource';
import loading from './loading';
import notifications from './notifications';
import record from './record';
import references from './references';
import saving from './saving';
import ui from './ui';
import auth, { isLoggedIn as innerIsLoggedIn } from './auth';

export default combineReducers({
    resources,
    loading,
    notifications,
    record,
    references,
    saving,
    ui,
    auth,
});

export const getResources = state => innerGetResources(state.resources);
export const isLoggedIn = state => innerIsLoggedIn(state.auth);
