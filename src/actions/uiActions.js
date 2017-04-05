export const TOGGLE_SIDEBAR = 'admin-on-rest/TOGGLE_SIDEBAR';

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});

export const SET_SIDEBAR_VISIBILITY = 'admin-on-rest/SET_SIDEBAR_VISIBILITY';

export const setSidebarVisibility = isOpen => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});
