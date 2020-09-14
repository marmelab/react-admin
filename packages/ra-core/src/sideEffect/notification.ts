import { put, takeEvery } from 'redux-saga/effects';
import {
    showNotification,
    NotificationType,
} from '../actions/notificationActions';

export interface NotificationSideEffect {
    body: string;
    level: NotificationType;
    messageArgs?: object;
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
    const { body, level, messageArgs = {} } = notification;
    if (error) {
        return yield put(
            showNotification(
                typeof error === 'string' ? error : error.message || body,
                level || 'warning',
                {
                    messageArgs,
                    undoable: false,
                }
            )
        );
    }
    yield put(
        showNotification(body, level || 'info', {
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
