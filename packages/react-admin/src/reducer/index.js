import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import admin, {
    getResources as getAdminResources,
    isLoggedIn as adminIsLoggedIn,
} from './admin';
import i18nReducer, { getLocale as adminGetLocale } from './i18n';

export default (customReducers, locale, messages) =>
    combineReducers({
        admin,
        i18n: i18nReducer(locale, messages),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });

export const getResources = state => getAdminResources(state.admin);
export const isLoggedIn = state => adminIsLoggedIn(state.admin);
export const getLocale = state => adminGetLocale(state.i18n);
