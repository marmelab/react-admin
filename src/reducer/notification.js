import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/notificationActions';

export default (previousState = '', { type, payload }) => {
    switch (type) {
    case SHOW_NOTIFICATION:
        return payload;
    case HIDE_NOTIFICATION:
        return '';
    default:
        return previousState;
    }
};
