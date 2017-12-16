import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import admin, {
    getResources as getAdminResources,
    hasDeclaredResources as hasAdminDeclaredResources,
} from './admin';
import localeReducer from './locale';

export default (customReducers, locale) =>
    combineReducers({
        admin,
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });

export const getResources = state => getAdminResources(state.admin);
export const hasDeclaredResources = state =>
    hasAdminDeclaredResources(state.admin);
