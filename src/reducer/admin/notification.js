import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
} from '../../actions/notificationActions';

export const initialState = {
    text: '',
    type: 'info', // one of 'info', 'confirm', 'warning'
    autoHideDuration: undefined, // use default duration from Notification
};

export default (previousState = initialState, { type, payload }) => {
    switch (type) {
        case SHOW_NOTIFICATION:
            return {
                text: payload.text,
                type: payload.type,
                autoHideDuration: payload.autoHideDuration,
            };
        case HIDE_NOTIFICATION:
            return { ...previousState, text: '' };
        default:
            return previousState;
    }
};
