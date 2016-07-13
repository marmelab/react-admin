export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

export const showNotification = (text) => ({
    type: SHOW_NOTIFICATION,
    payload: text,
});

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});
