import { combineReducers } from 'redux';
import { REGISTER_RESOURCE, UNREGISTER_RESOURCE } from '../../../actions';

import props from './props';
import data from './data';
import list from './list';

const defaultResourceReducer = combineReducers({
    props,
    data,
    list,
});

const initialState = {};
export default (
    previousState = initialState,
    action,
    resourceReducer = defaultResourceReducer
) => {
    if (action.type === REGISTER_RESOURCE) {
        return {
            ...previousState,
            [action.payload.name]: resourceReducer(undefined, action),
        };
    }
    if (action.type === UNREGISTER_RESOURCE) {
        return Object.keys(previousState).reduce((nextState, key) => {
            if (key !== action.payload) nextState[key] = previousState[key];
            return nextState;
        }, {});
    }

    if (!action.meta || !action.meta.resource) {
        return previousState;
    }
    const resourceState = previousState[action.meta.resource];
    const nextResourceState = resourceReducer(resourceState, action);

    return resourceState !== nextResourceState
        ? { ...previousState, [action.meta.resource]: nextResourceState }
        : previousState;
};

export const getResources = state =>
    Object.keys(state).map(key => state[key].props);

export const getReferenceResource = (state, props) => state[props.reference];
