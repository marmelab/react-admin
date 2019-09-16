import React from 'react';
import expect from 'expect';
import { cleanup, wait } from '@testing-library/react';

import useAuthState from './useAuthState';
import AuthContext from './AuthContext';
import renderWithRedux from '../util/renderWithRedux';

const UseAuth = ({ children, authParams }: any) => {
    const res = useAuthState(authParams);
    return children(res);
};

const stateInpector = state => (
    <div>
        <span>{state.loading && 'LOADING'}</span>
        <span>{state.loaded && 'LOADED'}</span>
        <span>{state.authenticated && 'AUTHENTICATED'}</span>
    </div>
);

describe('useAuthState', () => {
    afterEach(cleanup);

    it('should return a loading state on mount', () => {
        const { queryByText } = renderWithRedux(
            <UseAuth>{stateInpector}</UseAuth>
        );
        expect(queryByText('LOADING')).not.toBeNull();
        expect(queryByText('LOADED')).toBeNull();
        expect(queryByText('AUTHENTICATED')).not.toBeNull();
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

    it('should return an error after a tick if the auth fails', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('failed'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
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
    });
});
