import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';

import usePermissions from './usePermissions';
import AuthContext from './AuthContext';
import { renderWithRedux } from 'ra-test';

const UsePermissions = ({ children, authParams }: any) => {
    const res = usePermissions(authParams);
    return children(res);
};

const stateInpector = state => (
    <div>
        <span>{state.loading && 'LOADING'}</span>
        <span>{state.loaded && 'LOADED'}</span>
        {state.permissions && <span>PERMISSIONS: {state.permissions}</span>}
        <span>{state.error && 'ERROR'}</span>
    </div>
);

describe('usePermissions', () => {
    it('should return a loading state on mount', () => {
        const { queryByText } = renderWithRedux(
            <UsePermissions>{stateInpector}</UsePermissions>
        );
        expect(queryByText('LOADING')).not.toBeNull();
        expect(queryByText('LOADED')).toBeNull();
        expect(queryByText('AUTHENTICATED')).toBeNull();
    });

    it('should return nothing by default after a tick', async () => {
        const { queryByText } = renderWithRedux(
            <UsePermissions>{stateInpector}</UsePermissions>
        );
        await waitFor(() => {
            expect(queryByText('LOADING')).toBeNull();
            expect(queryByText('LOADED')).not.toBeNull();
        });
    });

    it('should return the permissions after a tick', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.resolve('admin'),
        };
        const { queryByText } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <UsePermissions>{stateInpector}</UsePermissions>
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(queryByText('LOADING')).toBeNull();
            expect(queryByText('LOADED')).not.toBeNull();
            expect(queryByText('PERMISSIONS: admin')).not.toBeNull();
        });
    });

    it('should return an error after a tick if the auth call fails', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('not good'),
        };
        const { queryByText } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <UsePermissions>{stateInpector}</UsePermissions>
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(queryByText('LOADING')).toBeNull();
            expect(queryByText('LOADED')).not.toBeNull();
            expect(queryByText('ERROR')).not.toBeNull();
        });
    });
});
