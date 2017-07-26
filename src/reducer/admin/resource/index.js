import { combineReducers } from 'redux';
import data from './data';
import list from './list';
import { DECLARE_RESOURCE } from '../../../actions'

const createResourceReducer = resource =>
    combineReducers({
        data: data(resource),
        list: list(resource),
    });

export default (state = {}, action) => {
    if (action.type === DECLARE_RESOURCE) {
        if (state[action.payload.name]) {
            return state;
        }

        return {
            ...state,
            [action.payload.name]: createResourceReducer(action.payload.name)(undefined, {}),
        };
    }

    if (!action.meta || !action.meta.resource || !state[action.meta.resource]) {
        return state;
    }

    return {
        ...state,
        [action.meta.resource]: createResourceReducer(action.meta.resource)(state[action.meta.resource], action),
    };
}
