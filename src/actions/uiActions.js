export const TOGGLE_SIDEBAR = 'AOR/TOGGLE_SIDEBAR';

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});

export const SET_SIDEBAR_VISIBILITY = 'AOR/SET_SIDEBAR_VISIBILITY';

export const setSidebarVisibility = isOpen => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});

export const REFRESH_VIEW = 'AOR/REFRESH_VIEW';

export const refreshView = () => ({
    type: REFRESH_VIEW,
});
