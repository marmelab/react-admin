import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { getData, getRecord, getRecordsByIds } from './resource';
import loading from './loading';
import notification from './notification';
import record from './record';
import references, { getPossibleValues, getIdsRelatedTo } from './references';
import saving from './saving';
import ui, { isSidebarOpen, getViewVersion } from './ui';
import resources, { mapToProps } from './resources';

export default combineReducers({
    resources,
    loading,
    notification,
    record,
    references,
    saving,
    ui,
});

export const getResources = state => state.resources;
export const getResourcesProps = state => mapToProps(getResources(state));
export const getResource = (state, { resource }) =>
    getResources(state)[resource];
export const getResourceData = (state, props) =>
    getData(getResource(state, props));
export const getResourceRecord = (state, props) =>
    getRecord(getResource(state, props), props);
export const getResourceRecordsByIds = (state, props) =>
    getRecordsByIds(getResource(state, props), props);

export const isLoading = state => state.loading > 0;

export const getNotification = state => state.notification;

export const getReferences = state => state.references;
export const getReferencePossibleValues = (state, { reference }) =>
    getPossibleValues(getReferences(state))[reference] || [];

export const isSaving = state => state.saving > 0;

export const getUI = state => state.ui;
export const isUISidebarOpen = state => isSidebarOpen(getUI(state));
export const getUIViewVersion = state => getViewVersion(getUI(state));

export const getSelectedIds = (state, { ids }) => ids || [];

export const makeGetPossibleReferences = () =>
    createSelector(
        [getReferencePossibleValues, getResourceData, getSelectedIds],
        (possibleValues, data, selectedIds) =>
            Array.from(possibleValues)
                .filter(id => selectedIds.includes(id))
                .map(id => data[id])
                .filter(r => typeof r !== 'undefined')
    );

export const getReferencesIdsRelatedTo = (state, { relatedTo }) =>
    getIdsRelatedTo(getReferences(state), { relatedTo });
