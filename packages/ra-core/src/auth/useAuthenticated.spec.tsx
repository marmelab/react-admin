import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { memoryStore } from '../store';

import { useNotificationContext } from '../notification';
import { CoreAdminContext } from '../core';
import { useAuthenticated } from '.';
import { TestMemoryRouter } from '../routing';

const Authenticated = ({ children, ...params }) => {
    useAuthenticated({ params });
    return children;
};

describe('useAuthenticated', () => {
    const Foo = () => <div>Foo</div>;

    it('should call authProvider on mount', () => {
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
                <Authenticated>
                    <Foo />
                </Authenticated>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </CoreAdminContext>
        );
        expect(authProvider.checkAuth).toBeCalledTimes(1);
        expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({
            signal: expect.anything(),
        });
        expect(reset).toHaveBeenCalledTimes(0);
    });

    it('should call authProvider on update', () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: jest.fn().mockResolvedValue(''),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const store = memoryStore();
        const reset = jest.spyOn(store, 'reset');

        const FooWrapper = props => (
            <CoreAdminContext authProvider={authProvider} store={store}>
                <Authenticated {...props}>
                    <Foo />
                </Authenticated>
            </CoreAdminContext>
        );
        const { rerender } = render(<FooWrapper />);
        rerender(<FooWrapper foo="bar" />);
        expect(authProvider.checkAuth).toBeCalledTimes(2);
        expect(authProvider.checkAuth.mock.calls[1][0]).toEqual({
            foo: 'bar',
            signal: expect.anything(),
        });
        expect(reset).toHaveBeenCalledTimes(0);
    });

    it('should not block rendering by default', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: jest.fn().mockResolvedValue(''),
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
        expect(screen.queryByText('Foo')).toBeDefined();
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
            <TestMemoryRouter>
                <CoreAdminContext authProvider={authProvider} store={store}>
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
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(authProvider.checkAuth).toHaveBeenCalledTimes(1);
        });
        expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({
            signal: expect.anything(),
        });
        await waitFor(
            () => {
                expect(authProvider.logout).toHaveBeenCalledTimes(1);
            },
            { timeout: 4000 }
        );
        expect(authProvider.logout.mock.calls[0][0]).toEqual({});
        expect(reset).toHaveBeenCalledTimes(1);
        expect(notificationsSpy).toEqual([
            {
                message: 'ra.auth.auth_check_error',
                type: 'error',
                notificationOptions: {},
            },
        ]);
        expect(screen.getByLabelText('nextPathname').innerHTML).toEqual('/');
    });
});
