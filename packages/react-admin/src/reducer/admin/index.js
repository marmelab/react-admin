import { combineReducers } from 'redux';
import resources, {
    getResources as innerGetResources,
    hasDeclaredResources as innerHasDeclaredResources,
} from './resource';
import loading from './loading';
import notifications from './notifications';
import record from './record';
import references from './references';
import saving from './saving';
import ui from './ui';

export default combineReducers({
    resources,
    loading,
    notifications,
    record,
    references,
    saving,
    ui,
});

export const hasDeclaredResources = state =>
    innerHasDeclaredResources(state.resources);
export const getResources = state => innerGetResources(state.resources);
