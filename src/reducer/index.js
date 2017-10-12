import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';
import admin, {
    getResourcesProps,
    getResource,
    getResourceData,
    getResourceRecord,
    getResourceRecordsByIds,
    isLoading,
    isSaving,
    makeGetPossibleReferences,
    getReferencesIdsRelatedTo,
    getNotification,
    isUISidebarOpen,
    getUIViewVersion,
} from './admin';
import localeReducer from './locale';

export default (customReducers, locale) =>
    combineReducers({
        admin,
        locale: localeReducer(locale),
        form,
        routing,
        ...customReducers,
    });

export const getAdmin = state => state.admin;
export const getAdminResourcesProps = state =>
    getResourcesProps(getAdmin(state));
export const getAdminResource = (state, props) =>
    getResource(getAdmin(state), props);
export const getAdminResourceData = (state, props) =>
    getResourceData(getAdmin(state), props);
export const getAdminResourceRecord = (state, props) =>
    getResourceRecord(getAdmin(state), props);
export const getAdminResourceRecordsByIds = (state, props) =>
    getResourceRecordsByIds(getAdmin(state), props);

export const isAdminLoading = state => isLoading(getAdmin(state));
export const isAdminSaving = state => isSaving(getAdmin(state));

export const makeGetAdminPossibleReferences = () => {
    const getPossibleReferences = makeGetPossibleReferences();

    return (state, props) => getPossibleReferences(getAdmin(state), props);
};

export const getIdsRelatedTo = (state, props) =>
    getReferencesIdsRelatedTo(getAdmin(state), props);

export const getLocale = state => state.locale;
export const getAdminNotification = state => getNotification(getAdmin(state));
export const isSidebarOpen = state => isUISidebarOpen(getAdmin(state));
export const getViewVersion = state => getUIViewVersion(getAdmin(state));
