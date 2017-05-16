import { combineReducers } from 'redux';
import resourceReducer, * as resourceSelectors from './resource';
import { getRecord } from './resource/data';
import loading from './loading';
import notification from './notification';
import references, * as referencesSelectors from './references';
import saving from './saving';
import ui from './ui';

export default (resources) => {
  const resourceReducers = {};
  resources.forEach((resource) => {
    resourceReducers[resource.name] = resourceReducer(resource.name, resource.options);
  });

  return combineReducers({
    resources: combineReducers(resourceReducers),
    loading,
    notification,
    references,
    saving,
    ui,
  });
};

export const getResources = (state) => state.resources;
export const getResource = (state) => (resource) => getResources(state)[resource];
export const getResourceData = (state) => (resource) => resourceSelectors.getData(getResource(state)(resource));
export const getResourceRecord = (state) => (resource, id) => resourceSelectors.getRecord(getResource(state)(resource))(id);

export const isLoading = (state) => state.loading > 0;
export const isSaving = (state) => state.saving > 0;

export const getReferences = (state) => state.references;
export const getPossibleValues = (state) => referencesSelectors.getPossibleValues(getReferences(state));
export const getPossibleReferences = (state) => (referenceSource, reference, selectedId) => {
  const referenceResource = getResource(state)(reference);
  if (!getPossibleValues(state)[referenceSource]) {
    return typeof selectedId === 'undefined' || !getRecord(referenceResource, selectedId) ? [] : getRecord(referenceResource, selectedId);
  }

  const possibleValues = getPossibleValues(state)[referenceSource];
  if (typeof selectedId !== 'undefined' && !possibleValues.includes(selectedId)) {
    possibleValues.unshift(selectedId);
  }

  return possibleValues
    .map(id => getRecord(referenceResource, id))
    .filter(r => typeof r !== 'undefined');
};

export const getIdsRelatedTo = (state) => referencesSelectors.getIdsRelatedTo(getReferences(state));
