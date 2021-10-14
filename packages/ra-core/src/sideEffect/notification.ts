import { put, takeEvery } from 'redux-saga/effects';
import {
    showNotification,
    NotificationType,
    NotificationOptions,
} from '../actions/notificationActions';

export interface NotificationSideEffect {
    body: string;
    level: NotificationType;
    notificationOptions?: NotificationOptions;
}

interface ActionWithSideEffect {
    type: string;
    payload?: any;
    error: string | { message: string };
    meta: {
        notification: NotificationSideEffect;
        optimistic?: boolean;
    };
}

/**
 * Notification Side Effects
 */
function* handleNotification({
    error,
    meta: { notification, optimistic },
}: ActionWithSideEffect) {
    const { body, level, notificationOptions = {} } = notification;
    const { autoHideDuration, messageArgs, undoable = false } =
        notificationOptions || {};
    if (error) {
        return yield put(
            showNotification(
                typeof error === 'string' ? error : error.message || body,
                level || 'warning',
                {
                    autoHideDuration,
                    messageArgs,
                    undoable,
                }
            )
        );
    }
    yield put(
        showNotification(body, level || 'info', {
            autoHideDuration,
            messageArgs,
            undoable: optimistic,
        })
    );
}

export default function* () {
    yield takeEvery(
        // @ts-ignore
        action => action.meta && action.meta.notification,
        handleNotification
    );
}
