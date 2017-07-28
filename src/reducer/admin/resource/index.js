import { combineReducers } from 'redux';
import data from './data';
import list from './list';
import ui from './ui';

const createResourceReducer = resource =>
    combineReducers({
        data: data(resource),
        list: list(resource),
        ui: ui(resource),
    });

export default (previousState = {}, action) => {
    if (!action.meta || !action.meta.resource) {
        return previousState;
    }

    let state = previousState;
    if (!previousState[action.meta.resource]) {
        state = {
            ...previousState,
            [action.payload.name]: createResourceReducer(action.payload.name)(
                undefined,
                {}
            ),
        };
    }

    return {
        ...state,
        [action.meta.resource]: createResourceReducer(action.meta.resource)(
            state[action.meta.resource],
            action
        ),
    };
};
