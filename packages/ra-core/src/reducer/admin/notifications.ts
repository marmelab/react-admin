import { Reducer } from 'redux';
import {
    SHOW_NOTIFICATION,
    ShowNotificationAction,
    HIDE_NOTIFICATION,
    HideNotificationAction,
    Notification,
} from '../../actions/notificationActions';
import { UNDO, UndoAction } from '../../actions/undoActions';

type ActionTypes = ShowNotificationAction | HideNotificationAction | UndoAction | { type: 'OTHER_TYPE' };

type State = Notification[];

const notificationsReducer: Reducer<State> = (previousState = [], action: ActionTypes) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return previousState.concat(action.payload);
        case HIDE_NOTIFICATION:
        case UNDO:
            return previousState.slice(1);
        default:
            return previousState;
    }
};

export default notificationsReducer;
/**
 * Returns the first available notification to show
 * @param {Object} state - Redux state
 */
export const getNotification = state => state.admin.notifications[0];
