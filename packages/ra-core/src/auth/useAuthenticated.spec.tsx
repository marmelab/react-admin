import React from 'react';
import expect from 'expect';
import { cleanup, wait } from '@testing-library/react';
import { push } from 'connected-react-router';

import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import renderWithRedux from '../util/renderWithRedux';
import { showNotification } from '../actions/notificationActions';

describe('useAuthenticated', () => {
    afterEach(cleanup);

    const Foo = () => <div>Foo</div>;

    it('should call authProvider on mount', () => {
        const authProvider = jest.fn(() => Promise.resolve());
        const { dispatch } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        expect(authProvider).toBeCalledTimes(1);
        expect(authProvider.mock.calls[0][0]).toBe('AUTH_CHECK');
        const payload = authProvider.mock.calls[0][1] as any;
        expect(payload.afterLoginUrl).toBe('/');
        expect(payload.loginUrl).toBe('/login');
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should call authProvider on update', () => {
        const authProvider = jest.fn(() => Promise.resolve());
        const FooWrapper = props => (
            <AuthContext.Provider value={authProvider}>
                <Authenticated {...props}>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        const { rerender, dispatch } = renderWithRedux(<FooWrapper />);
        rerender(<FooWrapper authParams={{ foo: 'bar' }} />);
        expect(authProvider).toBeCalledTimes(2);
        expect(authProvider.mock.calls[1][0]).toBe('AUTH_CHECK');
        const payload = authProvider.mock.calls[1][1] as any;
        expect(payload.foo).toBe('bar');
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should not block rendering by default', async () => {
        const { dispatch, queryByText } = renderWithRedux(
            <Authenticated>
                <Foo />
            </Authenticated>
        );
        expect(queryByText('Foo')).toBeDefined();
        await wait();
        expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should logout, redirect to login and show a notification after a tick if the auth fails', async () => {
        const authProvider = jest.fn(type =>
            type === 'AUTH_CHECK' ? Promise.reject() : Promise.resolve()
        );
        const { dispatch } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        await wait();
        expect(authProvider.mock.calls[0][0]).toBe('AUTH_CHECK');
        expect(authProvider.mock.calls[1][0]).toBe('AUTH_LOGOUT');
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch.mock.calls[0][0]).toEqual(
            showNotification('ra.auth.auth_check_error', 'warning', {
                messageArgs: {},
                undoable: false,
            })
        );
        expect(dispatch.mock.calls[1][0]).toEqual({ type: 'RA/CLEAR_STATE' });
        expect(dispatch.mock.calls[2][0]).toEqual(
            push({ pathname: '/login', state: { nextPathname: '/' } })
        );
    });
});
