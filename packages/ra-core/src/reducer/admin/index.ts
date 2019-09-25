import { combineReducers } from 'redux';
import resources, {
    getResources as resourceGetResources,
    getReferenceResource as resourceGetReferenceResource,
} from './resource';
import loading from './loading';
import notifications from './notifications';
import record from './record';
import references, {
    getPossibleReferenceValues as referencesGetPossibleReferenceValues,
} from './references';
import saving from './saving';
import ui from './ui';
import customQueries from './customQueries';

export default combineReducers({
    resources,
    customQueries,
    loading,
    notifications,
    record,
    references,
    saving,
    ui,
});

export const getPossibleReferenceValues = (state, props) =>
    referencesGetPossibleReferenceValues(state.references, props);

export const getResources = state => resourceGetResources(state.resources);

export const getReferenceResource = (state, props) => {
    return resourceGetReferenceResource(state.resources, props);
};

export { getPossibleReferences } from './references';
