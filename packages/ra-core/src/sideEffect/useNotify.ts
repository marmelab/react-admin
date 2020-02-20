import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    showNotification,
    NotificationType,
} from '../actions/notificationActions';

/**
 * Hook for Notification Side Effect
 *
 * @example
 *
 * const notify = useNotify();
 * // simple message (info level)
 * notify('Level complete');
 * // specify level
 * notify('A problem occurred', 'warning')
 * // pass arguments to the translation function
 * notify('Deleted %{count} elements', 'info', { smart_count: 23 })
 * // show the action as undoable in the notification
 * notify('Post renamed', 'info', {}, true)
 */
const useNotify = () => {
    const dispatch = useDispatch();
    return useCallback(
        (
            message: string,
            type: NotificationType = 'info',
            messageArgs: any = {},
            undoable: boolean = false,
            autoHideDuration?: number
        ) => {
            dispatch(
                showNotification(message, type, {
                    messageArgs,
                    undoable,
                    autoHideDuration,
                })
            );
        },
        [dispatch]
    );
};

export default useNotify;
