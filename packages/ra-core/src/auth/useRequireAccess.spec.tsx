import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';

import { QueryClient } from '@tanstack/react-query';
import { Basic } from './useRequireAccess.stories';

describe('useRequireAccess', () => {
    it('should return a loading state on mount', async () => {
        render(<Basic />);
        screen.getByText('Loading');
        await waitFor(() => {
            expect(screen.queryByText('Loading')).toBeNull();
        });
    });

    it('should allow access on mount when there is no authProvider', () => {
        render(<Basic authProvider={null} />);
        expect(screen.queryByText('Loading')).toBeNull();
        screen.getByText('Protected Content');
    });

    it('should allow access when canAccess return true', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(true),
        };
        render(<Basic authProvider={authProvider} />);
        await screen.findByText('Protected Content');
    });

    it('should allow access when auth provider does not have an canAccess method', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: undefined,
        };
        render(<Basic authProvider={authProvider} />);
        expect(screen.queryByText('Loading')).toBeNull();

        await screen.findByText('Protected Content');
    });

    it('should redirect to /access-denied when users do not have access', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(false),
        };
        render(<Basic authProvider={authProvider} />);

        await screen.findByText('Loading');
        await screen.findByText('Access denied');
    });

    it('should redirect to /authentication-error when auth.canAccess call fails', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            canAccess: () => Promise.reject('not good'),
        };
        render(<Basic authProvider={authProvider} />);
        await screen.findByText('Loading');
        await screen.findByText('Authentication Error');
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const authProvider = {
            canAccess: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
            checkError: () => Promise.resolve(),
            supportAbortSignal: true,
        } as any;
        const queryClient = new QueryClient();
        render(<Basic authProvider={authProvider} queryClient={queryClient} />);
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'canAccess'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
