import * as React from 'react';
import { useNotify } from './useNotify';
import { useNotificationContext } from './useNotificationContext';
import { NotificationContextProvider } from './NotificationContextProvider';

export default {
    title: 'ra-core/useNotify',
};

const Button = () => {
    const notify = useNotify();
    const handleClick = React.useCallback(() => {
        notify('hello');
    }, [notify]);
    return <button onClick={handleClick}>Notify</button>;
};

const Notifications = () => {
    const { notifications } = useNotificationContext();
    return (
        <ul>
            {notifications.map(({ message }, id) => (
                <li key={id}>{message}</li>
            ))}
        </ul>
    );
};

export const Basic = () => (
    <NotificationContextProvider>
        <Button />
        <Notifications />
    </NotificationContextProvider>
);

export const ManyListeners = () => {
    const times = new Array(100).fill(0);
    return (
        <NotificationContextProvider>
            {times.map((_, index) => (
                <Button key={index} />
            ))}
            <div>
                <Notifications />
            </div>
        </NotificationContextProvider>
    );
};
