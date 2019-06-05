import { Reducer } from 'redux';
import {
    TOGGLE_SIDEBAR,
    ToggleSidebarAction,
    SET_SIDEBAR_VISIBILITY,
    SetSidebarVisibilityAction,
    REFRESH_VIEW,
    RefreshViewAction,
    START_OPTIMISTIC_MODE,
    StartOptimisticModeAction,
    STOP_OPTIMISTIC_MODE,
    StopOptimisticModeAction,
} from '../../actions';
import { number } from '../../form';

type ActionTypes =
    | ToggleSidebarAction
    | SetSidebarVisibilityAction
    | RefreshViewAction
    | StartOptimisticModeAction
    | StopOptimisticModeAction
    | { type: 'OTHER_ACTION' };

interface State {
    readonly sidebarOpen: boolean;
    readonly optimistic: boolean;
    readonly viewVersion: number;
}

const defaultState: State = {
    sidebarOpen: false,
    optimistic: false,
    viewVersion: 0,
};

const uiReducer: Reducer<State> = (previousState = defaultState, action: ActionTypes) => {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...previousState,
                sidebarOpen: !previousState.sidebarOpen,
            };
        case SET_SIDEBAR_VISIBILITY:
            return { ...previousState, sidebarOpen: action.payload };
        case REFRESH_VIEW:
            return {
                ...previousState,
                viewVersion: previousState.viewVersion + 1,
            };
        case START_OPTIMISTIC_MODE:
            return { ...previousState, optimistic: true };
        case STOP_OPTIMISTIC_MODE:
            return { ...previousState, optimistic: false };
        default:
            return previousState;
    }
};

export default uiReducer;
