import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    showNotification,
    NotificationType,
    NotificationOptions,
} from '../actions/notificationActions';
import warning from '../util/warning';

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
            type?:
                | NotificationType
                | (NotificationOptions & { type: NotificationType }),
            messageArgs: any = {},
            undoable: boolean = false,
            autoHideDuration?: number,
            multiLine?: boolean
        ) => {
            if (typeof type === 'string') {
                warning(
                    true,
                    'This way of calling useNotify callback is deprecated. Please use the new syntax passing notify("[Your message]", { ...restOfArguments })'
                );
                dispatch(
                    showNotification(
                        message,
                        (type || 'info') as NotificationType,
                        {
                            messageArgs,
                            undoable,
                            autoHideDuration,
                            multiLine,
                        }
                    )
                );
            } else {
                const { type: messageType, ...options } = type || {};
                dispatch(showNotification(message, messageType, options));
            }
        },
        [dispatch]
    );
};

export default useNotify;
