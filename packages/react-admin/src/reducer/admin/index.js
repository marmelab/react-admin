import { combineReducers } from 'redux';
import resources, { getResources as resourcesGetResources } from './resource';
import loading from './loading';
import notifications from './notifications';
import record from './record';
import references, {
    getPossibleReferenceValues as referencesGetPossibleReferenceValues,
    getReferenceResource as referencesGetReferenceResource,
} from './references';
import saving from './saving';
import ui from './ui';
import auth, { isLoggedIn as authIsLoggedIn } from './auth';

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

export const getPossibleReferenceValues = (state, props) =>
    referencesGetPossibleReferenceValues(state.references, props);

export const getResources = state => resourcesGetResources(state.resources);

export const getReferenceResource = (state, props) =>
    referencesGetReferenceResource(state.resources, props);

export const isLoggedIn = state => authIsLoggedIn(state.auth);

export { getPossibleReferences } from './references';
