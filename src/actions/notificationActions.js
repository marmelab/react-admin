export const SHOW_NOTIFICATION = 'admin-on-rest/SHOW_NOTIFICATION';

export const showNotification = (text, type = 'info') => ({
    type: SHOW_NOTIFICATION,
    payload: { text, type },
});

export const HIDE_NOTIFICATION = 'admin-on-rest/HIDE_NOTIFICATION';

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});
