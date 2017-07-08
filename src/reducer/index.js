import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import adminReducer from './admin';
import localeReducer from './locale';

export default (resources, customReducers, locale) =>
    combineReducers({
        admin: adminReducer(resources),
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });
