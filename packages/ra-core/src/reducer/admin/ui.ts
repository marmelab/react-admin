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

type ActionTypes =
    | ToggleSidebarAction
    | SetSidebarVisibilityAction
    | RefreshViewAction
    | StartOptimisticModeAction
    | StopOptimisticModeAction
    | { type: 'OTHER_ACTION' };

export interface UIState {
    readonly sidebarOpen: boolean;
    readonly optimistic: boolean;
    readonly viewVersion: number;
}

// Match the medium breakpoint defined in the material-ui theme
// See https://material-ui.com/customization/breakpoints/#breakpoints
const isDesktop = (): boolean =>
    // (min-width: 960px) => theme.breakpoints.up('md')
    typeof window !== 'undefined' &&
    window.matchMedia &&
    typeof window.matchMedia === 'function'
        ? window.matchMedia('(min-width:960px)').matches
        : false;

const defaultState: UIState = {
    sidebarOpen: isDesktop(),
    optimistic: false,
    viewVersion: 0,
};

const uiReducer: Reducer<UIState> = (
    previousState = defaultState,
    action: ActionTypes
) => {
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
