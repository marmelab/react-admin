import {
    TOGGLE_SIDEBAR,
    SET_SIDEBAR_VISIBILITY,
    REFRESH_VIEW,
} from '../../actions';

const defaultState = {
    sidebarOpen: false,
    viewVersion: 0,
};

export default (previousState = defaultState, { type, payload }) => {
    switch (type) {
        case TOGGLE_SIDEBAR:
            return {
                ...previousState,
                sidebarOpen: !previousState.sidebarOpen,
            };
        case SET_SIDEBAR_VISIBILITY:
            return { ...previousState, sidebarOpen: payload };
        case REFRESH_VIEW:
            return {
                ...previousState,
                viewVersion: previousState.viewVersion + 1,
            };
        default:
            return previousState;
    }
};
