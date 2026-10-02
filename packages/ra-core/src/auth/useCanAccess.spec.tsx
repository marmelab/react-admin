import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';

import { QueryClient } from '@tanstack/react-query';
import { CoreAdminContext } from '../core';
import { useCanAccess } from './useCanAccess';
import { Basic } from './useCanAccess.stories';

describe('useCanAccess', () => {
    it('should return a loading state on mount', () => {
        render(<Basic />);
        screen.getByText('LOADING');
    });

    it('should return isPending: true by default after a tick', async () => {
        render(<Basic />);
        screen.getByText('LOADING');
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
    });

    it('should allow access on mount when there is no authProvider', async () => {
        render(<Basic authProvider={null} />);
        expect(screen.queryByText('LOADING')).toBeNull();
        screen.getByText('canAccess: YES');
        await new Promise(resolve => setTimeout(resolve, 100));
        screen.getByText('Renders: 1');
    });

    it('should return that the resource is accessible when canAccess return true', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(true),
        };
        render(<Basic authProvider={authProvider} />);
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: YES')).not.toBeNull();
        });
    });

    it('should return that the resource is accessible when auth provider does not have an canAccess method', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: undefined,
        };
        render(<Basic authProvider={authProvider} />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: YES')).not.toBeNull();
        });

        await new Promise(resolve => setTimeout(resolve, 100));
        screen.getByText('Renders: 1');
    });

    it('should return that the resource is not accessible when canAccess return false', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () => Promise.resolve(false),
        };
        render(<Basic authProvider={authProvider} />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('canAccess: NO')).not.toBeNull();
            expect(screen.queryByText('ERROR')).toBeNull();
        });
    });

    it('should return the error when auth.canAccess call fails', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            canAccess: () => Promise.reject(new Error('not good')),
        };
        render(<Basic authProvider={authProvider} />);
        await screen.findByText('LOADING');
        await screen.findByText('not good');
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

    it('should resolve the access checks that settle together in a single React commit', async () => {
        // Each useCanAccess with a record owns a distinct query, so resolving the
        // checks one by one makes React commit each of them separately. React 19
        // counts those commits as nested updates while an update from an earlier
        // commit is still pending, and throws "Maximum update depth exceeded" past
        // 50 of them, e.g. on a list with a link per row.
        // See https://github.com/marmelab/react-admin/issues/11392
        const CONSUMERS = 30;
        let commits = 0;
        const commitsWithResult: number[] = [];

        const Consumer = ({ id }: { id: number }) => {
            const { canAccess } = useCanAccess({
                resource: 'posts',
                action: 'show',
                record: { id },
            });
            const hadResult = React.useRef(false);
            React.useLayoutEffect(() => {
                if (canAccess !== undefined && !hadResult.current) {
                    hadResult.current = true;
                    commitsWithResult.push(commits);
                }
            });
            return <span>{canAccess === undefined ? 'pending' : 'done'}</span>;
        };

        const authProvider = {
            checkError: () => Promise.resolve(),
            canAccess: jest.fn(() => Promise.resolve(true)),
        } as any;
        render(
            <CoreAdminContext authProvider={authProvider}>
                <React.Profiler id="consumers" onRender={() => commits++}>
                    {Array.from({ length: CONSUMERS }, (_, index) => (
                        <Consumer key={index} id={index + 1} />
                    ))}
                </React.Profiler>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(commitsWithResult).toHaveLength(CONSUMERS);
        });
        expect(authProvider.canAccess).toHaveBeenCalledTimes(CONSUMERS);
        expect(new Set(commitsWithResult).size).toBe(1);
    });

    it('should not repopulate the cache of a query canceled while the check is in flight', async () => {
        const resolvers: ((canAccess: boolean) => void)[] = [];
        const authProvider = {
            checkError: () => Promise.resolve(),
            canAccess: jest.fn(
                () =>
                    new Promise<boolean>(resolve => {
                        resolvers.push(resolve);
                    })
            ),
        } as any;
        const Consumer = ({ id }: { id: number }) => {
            useCanAccess({ resource: 'posts', action: 'show', record: { id } });
            return null;
        };
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                authProvider={authProvider}
                queryClient={queryClient}
            >
                <Consumer id={1} />
                <Consumer id={2} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalledTimes(2);
        });
        const queryKeyFor = (recordId: number) => [
            'auth',
            'canAccess',
            { action: 'show', recordId, resource: 'posts' },
        ];
        await queryClient.cancelQueries({
            queryKey: queryKeyFor(1),
            exact: true,
        });
        resolvers.forEach(resolve => resolve(true));
        // the check that was not canceled still gets its result
        await waitFor(() => {
            expect(queryClient.getQueryData(queryKeyFor(2))).toBe(true);
        });
        // the canceled one is left alone
        expect(queryClient.getQueryData(queryKeyFor(1))).toBeUndefined();
    });

    it('should not write the result of a canceled check into a refetch of the same query', async () => {
        const resolvers: ((canAccess: boolean) => void)[] = [];
        const authProvider = {
            checkError: () => Promise.resolve(),
            canAccess: jest.fn(
                () =>
                    new Promise<boolean>(resolve => {
                        resolvers.push(resolve);
                    })
            ),
        } as any;
        const Consumer = () => {
            useCanAccess({
                resource: 'posts',
                action: 'show',
                record: { id: 1 },
            });
            return null;
        };
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                authProvider={authProvider}
                queryClient={queryClient}
            >
                <Consumer />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalledTimes(1);
        });
        const queryKey = [
            'auth',
            'canAccess',
            { action: 'show', recordId: 1, resource: 'posts' },
        ];
        await queryClient.cancelQueries({ queryKey, exact: true });
        // awaited once its call is resolved below
        const refetch = queryClient.refetchQueries({ queryKey, exact: true });
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalledTimes(2);
        });
        // the canceled call settles while the refetch is still running
        resolvers[0](false);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(queryClient.getQueryData(queryKey)).toBeUndefined();
        // the refetch gets its own result
        resolvers[1](true);
        await refetch;
        expect(queryClient.getQueryData(queryKey)).toBe(true);
    });
});
