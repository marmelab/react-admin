import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Routes, Route, useLocation } from 'react-router-dom';
import Authenticated from './Authenticated';
import { showNotification } from '../actions';
import { CoreAdminContext, createAdminStore } from '../core';

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
        const store = createAdminStore();
        const dispatch = jest.spyOn(store, 'dispatch');
        render(
            <Provider store={store}>
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={() => Promise.resolve()}
                >
                    <Authenticated>
                        <Foo />
                    </Authenticated>
                </CoreAdminContext>
            </Provider>
        );
        expect(authProvider.checkAuth).toBeCalledTimes(1);
        expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({});
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should call authProvider on update', () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: jest.fn().mockResolvedValue(''),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const store = createAdminStore();
        const dispatch = jest.spyOn(store, 'dispatch');

        const FooWrapper = props => (
            <Provider store={store}>
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={() => Promise.resolve()}
                >
                    <Authenticated {...props}>
                        <Foo />
                    </Authenticated>
                </CoreAdminContext>
            </Provider>
        );
        const { rerender } = render(<FooWrapper />);
        rerender(<FooWrapper authParams={{ foo: 'bar' }} />);
        expect(authProvider.checkAuth).toBeCalledTimes(2);
        expect(authProvider.checkAuth.mock.calls[1][0]).toEqual({ foo: 'bar' });
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should not block rendering by default', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: jest.fn().mockResolvedValue(''),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const store = createAdminStore();
        const dispatch = jest.spyOn(store, 'dispatch');

        render(
            <Provider store={store}>
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={() => Promise.resolve()}
                >
                    <Authenticated>
                        <Foo />
                    </Authenticated>
                </CoreAdminContext>
            </Provider>
        );
        expect(screen.queryByText('Foo')).toBeDefined();
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledTimes(0);
        });
    });

    it('should logout, redirect to login and show a notification after a tick if the auth fails', async () => {
        const authProvider = {
            login: jest.fn().mockResolvedValue(''),
            logout: jest.fn().mockResolvedValue(''),
            checkAuth: jest.fn().mockRejectedValue(undefined),
            checkError: jest.fn().mockResolvedValue(''),
            getPermissions: jest.fn().mockResolvedValue(''),
        };
        const store = createAdminStore();
        const dispatch = jest.spyOn(store, 'dispatch');
        const history = createMemoryHistory();

        const Login = () => {
            const location = useLocation();

            return (
                <div aria-label="nextPathname">
                    {location.state.nextPathname}
                </div>
            );
        };

        render(
            <Provider store={store}>
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={() => Promise.resolve()}
                    history={history}
                >
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
            </Provider>
        );
        await waitFor(() => {
            expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({});
            expect(authProvider.logout.mock.calls[0][0]).toEqual({});
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch.mock.calls[0][0]).toEqual(
                showNotification('ra.auth.auth_check_error', 'warning')
            );
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: 'RA/CLEAR_STATE',
            });
            expect(screen.getByLabelText('nextPathname').innerHTML).toEqual(
                '/'
            );
        });
    });
});
