import { combineReducers } from 'redux';
import resourceReducer from './resource';
import loading from './loading';
import localeReducer from './locale';
import notification from './notification';
import references from './references';
import saving from './saving';

export default (resources, locale) => {
    const resourceReducers = {};
    resources.forEach((resource) => {
        resourceReducers[resource.name] = resourceReducer(resource.name, resource.options);
    });
    return combineReducers({
        ...resourceReducers,
        locale: localeReducer(locale),
        loading,
        notification,
        references,
        saving,
    });
};
