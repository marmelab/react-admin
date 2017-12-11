import { combineReducers } from 'redux';
import locale from './locale';
import messages from './messages';
import loading from './loading';

export default (initialLocale, defaultMessages) => {
    return combineReducers({
        locale: locale(initialLocale),
        messages: messages(defaultMessages),
        loading,
    });
};

export const getLocale = state => state.locale;
