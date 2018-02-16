import { combineReducers } from 'redux';
import localeReducer from './locale';
import messagedReducer from './messages';
import loading from './loading';

export default (initialLocale, defaultMessages) =>
    combineReducers({
        locale: localeReducer(initialLocale),
        messages: messagedReducer(defaultMessages),
        loading,
    });

export const getLocale = state => state.locale;
