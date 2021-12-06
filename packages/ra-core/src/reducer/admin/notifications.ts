import { Reducer } from 'redux';
import {
    HIDE_NOTIFICATION,
    HideNotificationAction,
    NotificationPayload,
    RESET_NOTIFICATION,
    ResetNotificationAction,
    SHOW_NOTIFICATION,
    ShowNotificationAction,
    UNDO,
    UndoAction,
} from '../../actions';

type ActionTypes =
    | ShowNotificationAction
    | HideNotificationAction
    | ResetNotificationAction
    | UndoAction
    | { type: 'OTHER_TYPE' };

type State = NotificationPayload[];

const initialState = [];

const notificationsReducer: Reducer<State> = (
    previousState = initialState,
    action: ActionTypes
) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return previousState.concat(action.payload);
        case HIDE_NOTIFICATION:
        case UNDO:
            return previousState.slice(1);
        case RESET_NOTIFICATION:
            return initialState;
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
