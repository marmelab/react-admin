import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useCanAccess from './useCanAccess';
import { QueryClient } from '@tanstack/react-query';

const UseCanAccess = ({
    children,
    action,
    resource,
    record,
}: {
    children: any;
    action: string;
    resource: string;
    record?: unknown;
}) => {
    const res = useCanAccess({
        action,
        resource,
        record,
        retry: false,
    });

    return children(res);
};

const stateInpector = state => (
    <div>
        <span>{state.isPending && 'LOADING'}</span>
        {state.isAccessible !== undefined && (
            <span>isAccessible: {state.isAccessible ? 'YES' : 'NO'}</span>
        )}
        <span>{state.error && 'ERROR'}</span>
    </div>
);

describe('useCanAccess', () => {
    it('should return a loading state on mount', () => {
        render(
            <CoreAdminContext>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        expect(screen.queryByText('LOADING')).not.toBeNull();
        expect(screen.queryByText('AUTHENTICATED')).toBeNull();
    });

    it('should return nothing by default after a tick', async () => {
        render(
            <CoreAdminContext>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
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
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
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
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });
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
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('isAccessible: NO')).not.toBeNull();
        });
    });

    it('should return an error after a tick if the auth.canAccess call fails and checkError resolves', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            checkError: () => Promise.resolve(),
            canAccess: () => Promise.reject('not good'),
        };
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('ERROR')).not.toBeNull();
        });
    });

    it('should call logout when the auth.getPermissions call fails and checkError rejects', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: jest.fn(() => Promise.resolve()),
            checkAuth: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            checkError: () => Promise.reject(),
            canAccess: () => Promise.reject('not good'),
        };
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        expect(authProvider.logout).toHaveBeenCalled();
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
        } as any;
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                authProvider={authProvider}
                queryClient={queryClient}
            >
                <UseCanAccess action="read" resource="test">
                    {stateInpector}
                </UseCanAccess>
            </CoreAdminContext>
        );
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
