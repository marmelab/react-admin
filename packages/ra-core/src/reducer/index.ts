import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import admin, {
    getResources as adminGetResources,
    getReferenceResource as adminGetReferenceResource,
    getPossibleReferenceValues as adminGetPossibleReferenceValues,
    isLoggedIn as adminIsLoggedIn,
    selectViewVersion as adminSelectViewVersion,
    selectIsSidebarOpen as adminSelectIsSidebarOpen,
    selectIsOptimistic as adminSelectIsOptimistic,
    selectIsLoading as adminSelectIsLoading,
} from './admin';
export { getNotification } from './admin/notifications';
import i18nReducer, { getLocale as adminGetLocale } from './i18n';
import { ReduxState } from '../types';
export default (customReducers, locale, messages, history) =>
    combineReducers({
        admin,
        i18n: i18nReducer(locale, messages),
        form: formReducer,
        router: connectRouter(history),
        ...customReducers,
    });

export const getPossibleReferenceValues = (state: ReduxState, props) =>
    adminGetPossibleReferenceValues(state.admin, props);

export const getResources = (state: ReduxState) =>
    adminGetResources(state.admin);

export const getReferenceResource = (state: ReduxState, props) =>
    adminGetReferenceResource(state.admin, props);

export const isLoggedIn = (state: ReduxState) => adminIsLoggedIn(state.admin);

export const getLocale = (state: ReduxState) => adminGetLocale(state.i18n);

export const selectViewVersion = (state: ReduxState) =>
    adminSelectViewVersion(state.admin);

export const selectIsSidebarOpen = (state: ReduxState) =>
    adminSelectIsSidebarOpen(state.admin);

export const selectIsOptimistic = (state: ReduxState) =>
    adminSelectIsOptimistic(state.admin);

export const selectIsLoading = (state: ReduxState) =>
    adminSelectIsLoading(state.admin);

export { getPossibleReferences } from './admin';
