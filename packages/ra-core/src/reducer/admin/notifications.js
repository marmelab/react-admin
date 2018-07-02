import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
} from '../../actions/notificationActions';
import { UNDO } from '../../actions/undoActions';

export default (previousState = [], { type, payload }) => {
    switch (type) {
        case SHOW_NOTIFICATION:
            return previousState.concat(payload);
        case HIDE_NOTIFICATION:
        case UNDO:
            return previousState.slice(1);
        default:
            return previousState;
    }
};

/**
 * Returns the first available notification to show
 * @param {Object} state - Redux state
 */
export const getNotification = state => state.admin.notifications[0];
