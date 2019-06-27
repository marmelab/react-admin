import React from 'react';
import expect from 'expect';
import { cleanup, wait } from 'react-testing-library';
import { replace } from 'connected-react-router';

import useAuth from './useAuth';
import AuthContext from './AuthContext';
import { showNotification } from '../actions/notificationActions';
import renderWithRedux from '../util/renderWithRedux';

const UseAuth = ({ children, authParams, options }: any) => {
    const res = useAuth(authParams, options);
    return children(res);
};

const stateInpector = state => (
    <div>
        <span>{state.loading && 'LOADING'}</span>
        <span>{state.loaded && 'LOADED'}</span>
        <span>{state.authenticated && 'AUTHENTICATED'}</span>
        <span>{state.error && 'ERROR'}</span>
    </div>
);

describe('useAuth', () => {
    afterEach(cleanup);

    it('should return a loading state on mount', () => {
        const { queryByText } = renderWithRedux(
            <UseAuth>{stateInpector}</UseAuth>
        );
        expect(queryByText('LOADING')).not.toBeNull();
        expect(queryByText('LOADED')).toBeNull();
        expect(queryByText('AUTHENTICATED')).toBeNull();
    });

    it('should return authenticated by default after a tick', async () => {
        const { queryByText } = renderWithRedux(
            <UseAuth>{stateInpector}</UseAuth>
        );
        await wait();
        expect(queryByText('LOADING')).toBeNull();
        expect(queryByText('LOADED')).not.toBeNull();
        expect(queryByText('AUTHENTICATED')).not.toBeNull();
    });

    it('should logout, redirect to login and show a notification after a tick if the auth fails', async () => {
        const authProvider = jest.fn(type =>
            type === 'AUTH_CHECK' ? Promise.reject() : Promise.resolve()
        );
        const { dispatch } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <UseAuth>{stateInpector}</UseAuth>
            </AuthContext.Provider>
        );
        await wait();
        expect(authProvider.mock.calls[0][0]).toBe('AUTH_CHECK');
        expect(authProvider.mock.calls[1][0]).toBe('AUTH_LOGOUT');
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch.mock.calls[0][0]).toEqual(
            replace({ pathname: '/login', state: { nextPathname: '/' } })
        );
        expect(dispatch.mock.calls[1][0]).toEqual(
            showNotification('ra.auth.auth_check_error', 'warning')
        );
    });

    it('should return an error after a tick if the auth fails and logoutOnFailure is false', async () => {
        const authProvider = () => Promise.reject('not good');
        const { queryByText } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <UseAuth options={{ logoutOnFailure: false }}>
                    {stateInpector}
                </UseAuth>
            </AuthContext.Provider>
        );
        await wait();
        expect(queryByText('LOADING')).toBeNull();
        expect(queryByText('LOADED')).not.toBeNull();
        expect(queryByText('AUTHENTICATED')).toBeNull();
        expect(queryByText('ERROR')).not.toBeNull();
    });
});
