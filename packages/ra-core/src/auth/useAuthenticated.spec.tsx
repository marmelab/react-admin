import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';

import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import { renderWithRedux } from 'ra-test';
import { showNotification } from '../actions/notificationActions';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

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
        const { dispatch } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
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
        const FooWrapper = props => (
            <AuthContext.Provider value={authProvider}>
                <Authenticated {...props}>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        const { rerender, dispatch } = renderWithRedux(<FooWrapper />);
        rerender(<FooWrapper authParams={{ foo: 'bar' }} />);
        expect(authProvider.checkAuth).toBeCalledTimes(2);
        expect(authProvider.checkAuth.mock.calls[1][0]).toEqual({ foo: 'bar' });
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should not block rendering by default', async () => {
        const { dispatch, queryByText } = renderWithRedux(
            <Authenticated>
                <Foo />
            </Authenticated>
        );
        expect(queryByText('Foo')).toBeDefined();
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

        const history = createMemoryHistory();

        const { dispatch } = renderWithRedux(
            <Router history={history}>
                <AuthContext.Provider value={authProvider}>
                    <Authenticated>
                        <Foo />
                    </Authenticated>
                </AuthContext.Provider>
            </Router>
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
            expect(history.location.pathname).toEqual('/login');
            expect(history.location.state).toEqual({
                nextPathname: '/',
                nextSearch: '',
            });
        });
    });
});
