import * as React from 'react';
import { expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { memoryStore } from '../store';
import { CoreAdminContext } from '../core';
import { useNotificationContext } from '../notification';
import { Authenticated } from './Authenticated';
import { TestMemoryRouter } from '../routing';

describe('<Authenticated>', () => {
    const Foo = () => <div>Foo</div>;

    it('should not render its child while loading', async () => {
        const authProvider = {
            checkAuth: new Promise(() => {}),
        } as any;

        render(
            <CoreAdminContext authProvider={authProvider}>
                <Authenticated loading={<div>Loading</div>}>
                    <Foo />
                </Authenticated>
            </CoreAdminContext>
        );
        await screen.findByText('Loading');
    });

    it('should not render its child when checkAuth raises an error', async () => {
        const NeverDisplayedComponent = vi.fn(() => (
            <div>It should not be called</div>
        ));

        const authProvider = {
            checkAuth: vi.fn().mockRejectedValue(undefined),
            logout: vi.fn().mockResolvedValue(undefined),
        } as any;

        render(
            <CoreAdminContext authProvider={authProvider}>
                <Authenticated>
                    <NeverDisplayedComponent />
                </Authenticated>
            </CoreAdminContext>
        );

        // Ensure that the NeverDisplayedComponent is not called
        await waitFor(() => {
            // Ensure that checkAuth and logout were called as expected
            expect(authProvider.checkAuth).toHaveBeenCalled();
            expect(authProvider.logout).toHaveBeenCalled();
            expect(NeverDisplayedComponent).toHaveBeenCalledTimes(0);
        });
    });

    it('should render its child when authenticated', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: vi.fn().mockResolvedValueOnce(''),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const store = memoryStore();
        const reset = vi.spyOn(store, 'reset');

        render(
            <CoreAdminContext authProvider={authProvider} store={store}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </CoreAdminContext>
        );
        await screen.findByText('Foo');
        expect(reset).toHaveBeenCalledTimes(0);
    });

    it('should logout, redirect to login and show a notification if the auth fails', async () => {
        const authProvider = {
            login: vi.fn().mockResolvedValue(''),
            logout: vi.fn().mockResolvedValue(''),
            checkAuth: vi.fn().mockRejectedValue(undefined),
            checkError: vi.fn().mockResolvedValue(''),
            getPermissions: vi.fn().mockResolvedValue(''),
        };
        const store = memoryStore();
        const reset = vi.spyOn(store, 'reset');

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
            expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({
                signal: expect.anything(),
            });
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
