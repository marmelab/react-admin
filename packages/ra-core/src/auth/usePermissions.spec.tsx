import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import {
    NoAuthProvider,
    NoAuthProviderGetPermissions,
    WithAuthProviderAndGetPermissions,
} from './usePermissions.stories';
import { AuthProvider } from '..';

describe('usePermissions', () => {
    it('should return a loading state on mount with an authProvider that supports permissions', async () => {
        let resolveGetPermissions;
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => {
                return new Promise(resolve => {
                    resolveGetPermissions = resolve;
                });
            },
        };
        render(
            <WithAuthProviderAndGetPermissions authProvider={authProvider} />
        );
        expect(screen.queryByText('LOADING')).not.toBeNull();
        expect(screen.queryByText('PERMISSIONS: ')).toBeNull();
        resolveGetPermissions('admin');
        await screen.findByText('PERMISSIONS: admin');
    });

    it('should return immediately without an authProvider', async () => {
        render(<NoAuthProvider />);
        expect(screen.queryByText('LOADING')).toBeNull();
        expect(screen.queryByText('PERMISSIONS: ')).toBeNull();
    });

    it('should return immediately without an authProvider that supports permissions', async () => {
        render(<NoAuthProviderGetPermissions />);
        expect(screen.queryByText('LOADING')).toBeNull();
        expect(screen.queryByText('PERMISSIONS: ')).toBeNull();
    });

    it('should return the permissions after a tick', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.resolve('admin'),
        };
        render(
            <WithAuthProviderAndGetPermissions authProvider={authProvider} />
        );
        await screen.findByText('PERMISSIONS: admin');
        expect(screen.queryByText('LOADING')).toBeNull();
    });

    it('should return an error after a tick if the auth.getPermissions call fails and checkError resolves', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.reject('not good'),
        };
        render(
            <WithAuthProviderAndGetPermissions authProvider={authProvider} />
        );
        await screen.findByText('ERROR');
        expect(screen.queryByText('LOADING')).toBeNull();
    });

    it('should call logout when the auth.getPermissions call fails and checkError rejects', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: jest.fn(() => Promise.resolve()),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject(),
            getPermissions: () => Promise.reject('not good'),
        };
        render(
            <WithAuthProviderAndGetPermissions authProvider={authProvider} />
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        expect(authProvider.logout).toHaveBeenCalled();
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: jest.fn(() => Promise.resolve()),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject(),
            getPermissions: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ),
        };
        const queryClient = new QueryClient();
        render(
            <WithAuthProviderAndGetPermissions
                authProvider={authProvider}
                queryClient={queryClient}
            />
        );
        await waitFor(() => {
            expect(authProvider.getPermissions).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'getPermissions'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
