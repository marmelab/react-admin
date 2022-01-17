import { Reducer } from 'redux';
import {
    TOGGLE_SIDEBAR,
    ToggleSidebarAction,
    SET_SIDEBAR_VISIBILITY,
    SetSidebarVisibilityAction,
} from '../../actions';

type ActionTypes =
    | ToggleSidebarAction
    | SetSidebarVisibilityAction
    | { type: 'OTHER_ACTION' };

export interface UIState {
    readonly sidebarOpen: boolean;
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
            return {
                ...previousState,
                sidebarOpen: action.payload,
            };
        default:
            return previousState;
    }
};

export default uiReducer;
