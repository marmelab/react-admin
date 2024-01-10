import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import usePermissions from './usePermissions';

const UsePermissions = ({ children }: any) => {
    const permissionQueryParams = {
        retry: false,
    };
    const res = usePermissions({}, permissionQueryParams);
    return children(res);
};

const stateInpector = state => (
    <div>
        <span>{state.isLoading && 'LOADING'}</span>
        {state.permissions && <span>PERMISSIONS: {state.permissions}</span>}
        <span>{state.error && 'ERROR'}</span>
    </div>
);

describe('usePermissions', () => {
    it('should return a loading state on mount', () => {
        render(
            <CoreAdminContext>
                <UsePermissions>{stateInpector}</UsePermissions>
            </CoreAdminContext>
        );
        expect(screen.queryByText('LOADING')).not.toBeNull();
        expect(screen.queryByText('AUTHENTICATED')).toBeNull();
    });

    it('should return nothing by default after a tick', async () => {
        render(
            <CoreAdminContext>
                <UsePermissions>{stateInpector}</UsePermissions>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
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
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UsePermissions>{stateInpector}</UsePermissions>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('PERMISSIONS: admin')).not.toBeNull();
        });
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
            <CoreAdminContext authProvider={authProvider}>
                <UsePermissions>{stateInpector}</UsePermissions>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
            expect(screen.queryByText('ERROR')).not.toBeNull();
        });
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
            <CoreAdminContext authProvider={authProvider}>
                <UsePermissions>{stateInpector}</UsePermissions>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('LOADING')).toBeNull();
        });
        expect(authProvider.logout).toHaveBeenCalled();
    });
});
