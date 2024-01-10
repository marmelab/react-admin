import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useAuthState from './useAuthState';

const UseAuth = (authParams: any) => {
    const state = useAuthState(authParams);
    return (
        <div>
            <span>{state.isLoading && 'LOADING'}</span>
            <span>{state.authenticated && 'AUTHENTICATED'}</span>
        </div>
    );
};

describe('useAuthState', () => {
    it('should return a loading state on mount', () => {
        render(
            <CoreAdminContext>
                <UseAuth />
            </CoreAdminContext>
        );
        expect(screen.queryByText('LOADING')).not.toBeNull();
        expect(screen.queryByText('AUTHENTICATED')).not.toBeNull();
    });

    it('should return authenticated by default after a tick', async () => {
        render(
            <CoreAdminContext>
                <UseAuth />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('AUTHENTICATED')).not.toBeNull();
        });
    });

    it('should return an error after a tick if the auth fails', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('failed'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseAuth options={{ logoutOnFailure: false }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('AUTHENTICATED')).toBeNull();
        });
    });
});
