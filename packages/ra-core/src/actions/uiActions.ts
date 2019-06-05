export const TOGGLE_SIDEBAR = 'RA/TOGGLE_SIDEBAR';

export interface ToggleSidebarAction {
    readonly type: typeof TOGGLE_SIDEBAR;
}

export const toggleSidebar = (): ToggleSidebarAction => ({
    type: TOGGLE_SIDEBAR,
});

export const SET_SIDEBAR_VISIBILITY = 'RA/SET_SIDEBAR_VISIBILITY';

export interface SetSidebarVisibilityAction {
    readonly type: typeof SET_SIDEBAR_VISIBILITY;
    readonly payload: boolean;
}

export const setSidebarVisibility = (isOpen: boolean): SetSidebarVisibilityAction => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});

export const REFRESH_VIEW = 'RA/REFRESH_VIEW';

export interface RefreshViewAction {
    readonly type: typeof REFRESH_VIEW;
}

export const refreshView = (): RefreshViewAction => ({
    type: REFRESH_VIEW,
});
