import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import admin, {
    getResources as adminGetResources,
    getReferenceResource as adminGetReferenceResource,
    getPossibleReferenceValues as adminGetPossibleReferenceValues,
} from './admin';
import i18nReducer, { getLocale as adminGetLocale } from './i18n';
export { getNotification } from './admin/notifications';
export default (customReducers, locale, messages, history) =>
    combineReducers({
        admin,
        i18n: i18nReducer(locale, messages),
        router: connectRouter(history),
        ...customReducers,
    });

export const getPossibleReferenceValues = (state, props) =>
    adminGetPossibleReferenceValues(state.admin, props);
export const getResources = state => adminGetResources(state.admin);
export const getReferenceResource = (state, props) =>
    adminGetReferenceResource(state.admin, props);
export const getLocale = state => adminGetLocale(state.i18n);
export { getPossibleReferences } from './admin';
