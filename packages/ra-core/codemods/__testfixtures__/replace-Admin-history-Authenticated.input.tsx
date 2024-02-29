import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Routes, Route, useLocation } from 'react-router-dom';

// @ts-ignore
import { memoryStore } from '../store';
// @ts-ignore
import { CoreAdminContext } from '../core';
// @ts-ignore
import { useNotificationContext } from '../notification';
// @ts-ignore
import { Authenticated } from './Authenticated';

describe('<Authenticated>', () => {
    const Foo = () => <div>Foo</div>;

    it('should render its child by default', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: jest.fn().mockResolvedValueOnce(''),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const store = memoryStore();
        const reset = jest.spyOn(store, 'reset');

        render(
            <CoreAdminContext authProvider={authProvider} store={store}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </CoreAdminContext>
        );
        expect(screen.queryByText('Foo')).not.toBeNull();
        expect(reset).toHaveBeenCalledTimes(0);
    });

    it('should logout, redirect to login and show a notification after a tick if the auth fails', async () => {
        const authProvider = {
            login: jest.fn().mockResolvedValue(''),
            logout: jest.fn().mockResolvedValue(''),
            checkAuth: jest.fn().mockRejectedValue(undefined),
            checkError: jest.fn().mockResolvedValue(''),
            getPermissions: jest.fn().mockResolvedValue(''),
        };
        const store = memoryStore();
        const reset = jest.spyOn(store, 'reset');
        const history = createMemoryHistory();

        const Login = () => {
            const location = useLocation();
            return (
                <div aria-label="nextPathname">
                    {(location.state as any).nextPathname}
                </div>
            );
        };

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext
                authProvider={authProvider}
                store={store}
                history={history}
            >
                <Notification />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Authenticated>
                                <Foo />
                            </Authenticated>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({});
            expect(authProvider.logout.mock.calls[0][0]).toEqual({});
            expect(reset).toHaveBeenCalledTimes(1);
            expect(notificationsSpy).toEqual([
                {
                    message: 'ra.auth.auth_check_error',
                    type: 'error',
                    notificationOptions: {},
                },
            ]);
            expect(screen.getByLabelText('nextPathname').innerHTML).toEqual(
                '/'
            );
        });
    });
});
