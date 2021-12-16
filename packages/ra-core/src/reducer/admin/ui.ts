import { Reducer } from 'redux';
import {
    TOGGLE_SIDEBAR,
    ToggleSidebarAction,
    START_OPTIMISTIC_MODE,
    StartOptimisticModeAction,
    STOP_OPTIMISTIC_MODE,
    StopOptimisticModeAction,
} from '../../actions';
import {
    SET_AUTOMATIC_REFRESH,
    SetAutomaticRefreshAction,
} from '../../actions/uiActions';

type ActionTypes =
    | ToggleSidebarAction
    | StartOptimisticModeAction
    | StopOptimisticModeAction
    | SetAutomaticRefreshAction
    | { type: 'OTHER_ACTION' };

export interface UIState {
    readonly sidebarOpen: boolean;
    readonly optimistic: boolean;
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
        case SET_AUTOMATIC_REFRESH:
            return {
                ...previousState,
                automaticRefreshEnabled: action.payload,
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
