import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useAuthState from './useAuthState';
import { QueryClient } from '@tanstack/react-query';

const UseAuth = (authParams: any) => {
    const state = useAuthState(authParams);
    return (
        <div>
            <span>{state.isPending && 'LOADING'}</span>
            <span>AUTHENTICATED: {state.authenticated?.toString()}</span>
        </div>
    );
};

describe('useAuthState', () => {
    it('should return authenticated by default after a tick', async () => {
        render(
            <CoreAdminContext>
                <UseAuth />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        screen.getByText('AUTHENTICATED: true');
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
        });
        screen.getByText('AUTHENTICATED: false');
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const authProvider = {
            checkAuth: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        } as any;
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                authProvider={authProvider}
                queryClient={queryClient}
            >
                <UseAuth />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(authProvider.checkAuth).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'checkAuth'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
