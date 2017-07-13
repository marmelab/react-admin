export const SHOW_NOTIFICATION = 'AOR/SHOW_NOTIFICATION';

export const showNotification = (text, type = 'info') => ({
    type: SHOW_NOTIFICATION,
    payload: { text, type },
});

export const HIDE_NOTIFICATION = 'AOR/HIDE_NOTIFICATION';

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});
