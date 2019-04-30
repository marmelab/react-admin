import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import admin, {
    getResources as adminGetResources,
    getReferenceResource as adminGetReferenceResource,
    getPossibleReferenceValues as adminGetPossibleReferenceValues,
    isLoggedIn as adminIsLoggedIn,
} from './admin';
export { getNotification } from './admin/notifications';
import i18nReducer, { getLocale as adminGetLocale } from './i18n';
export default (customReducers, locale, messages, history) =>
    combineReducers({
        admin,
        i18n: i18nReducer(locale, messages),
        form: formReducer,
        router: connectRouter(history),
        ...customReducers,
    });

export const getPossibleReferenceValues = (state, props) =>
    adminGetPossibleReferenceValues(state.admin, props);
export const getResources = state => adminGetResources(state.admin);
export const getReferenceResource = (state, props) =>
    adminGetReferenceResource(state.admin, props);
export const isLoggedIn = state => adminIsLoggedIn(state.admin);
export const getLocale = state => adminGetLocale(state.i18n);
export { getPossibleReferences } from './admin';
