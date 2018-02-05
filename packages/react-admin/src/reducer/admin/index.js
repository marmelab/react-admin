import { combineReducers } from 'redux';
import resources, { getResources as innerGetResources } from './resource';
import loading from './loading';
import notifications from './notifications';
import record from './record';
import references, {
    getPossibleValues,
    getReferenceResource as innerGetReferenceResource,
} from './references';
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

export const getPossibleReferenceValues = (state, resource) =>
    getPossibleValues(state.references, resource);

export const getResources = state => innerGetResources(state.resources);

export const getReferenceResource = (state, props) =>
    innerGetReferenceResource(state.resources, props);

export const isLoggedIn = state => innerIsLoggedIn(state.auth);

export { getPossibleReferences } from './references';
