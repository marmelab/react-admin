import { TOGGLE_SIDEBAR, SET_SIDEBAR_VISIBILITY } from '../actions';

const defaultState = {
    sidebarOpen: false,
};

export default (previousState = defaultState, { type, payload }) => {
    switch (type) {
    case TOGGLE_SIDEBAR:
        return { ...previousState, sidebarOpen: !previousState.sidebarOpen };
    case SET_SIDEBAR_VISIBILITY:
        return { ...previousState, sidebarOpen: payload };
    default:
        return previousState;
    }
};
