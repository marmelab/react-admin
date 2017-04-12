export const TOGGLE_SIDEBAR = 'aor/TOGGLE_SIDEBAR';

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});

export const SET_SIDEBAR_VISIBILITY = 'aor/SET_SIDEBAR_VISIBILITY';

export const setSidebarVisibility = isOpen => ({
    type: SET_SIDEBAR_VISIBILITY,
    payload: isOpen,
});
