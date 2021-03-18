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

export const setSidebarVisibility = (
    isOpen: boolean
): SetSidebarVisibilityAction => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});

// refresh increases version (i.e. forces refetch) and empties the cache
export const REFRESH_VIEW = 'RA/REFRESH_VIEW';

export interface RefreshViewAction {
    readonly type: typeof REFRESH_VIEW;
}

export const refreshView = (): RefreshViewAction => ({
    type: REFRESH_VIEW,
});

// soft refresh only increases version (i.e. forces refetch)
export const SOFT_REFRESH_VIEW = 'RA/SOFT_REFRESH_VIEW';

export interface SoftRefreshViewAction {
    readonly type: typeof SOFT_REFRESH_VIEW;
}

export const softRefreshView = (): SoftRefreshViewAction => ({
    type: SOFT_REFRESH_VIEW,
});

export const SET_AUTOMATIC_REFRESH = 'RA/SET_AUTOMATIC_REFRESH';

export interface SetAutomaticRefreshAction {
    readonly type: typeof SET_AUTOMATIC_REFRESH;
    readonly payload: boolean;
}

export const setAutomaticRefresh = (enabled: boolean) => ({
    type: SET_AUTOMATIC_REFRESH,
    payload: enabled,
});
