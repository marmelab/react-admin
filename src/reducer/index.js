import { combineReducers } from 'redux';
import resourceReducer from './resource';
import loading from './loading';
import notification from './notification';

export default (resources) => {
    const resourceReducers = {};
    resources.forEach(resource => {
        resourceReducers[resource] = resourceReducer(resource);
    });
    return combineReducers({
        ...resourceReducers,
        loading,
        notification,
    });
};
