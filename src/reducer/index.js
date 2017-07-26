import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import adminReducer from './admin';
import localeReducer from './locale';

export default (customReducers, locale) =>
    combineReducers({
        admin: adminReducer,
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });
