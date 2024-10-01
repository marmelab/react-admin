import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    Basic,
    CustomLoading,
    CustomAccessDenied,
    NoAuthProvider,
    AccessDenied,
} from './CanAccess.stories';
import { AuthProvider } from '..';

describe('<CanAccess>', () => {
    it('renders nothing while loading by default', async () => {
        let resolveCheckAuth;
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () =>
                new Promise(resolve => {
                    resolveCheckAuth = resolve;
                }),
        };
        const { container } = render(<Basic authProvider={authProvider} />);
        expect(container.textContent).toEqual('');
        expect(screen.queryByText('protected content')).toBeNull();
        resolveCheckAuth(true);
        await screen.findByText('protected content');
    });
    it('shows the custom loading element while loading', async () => {
        let resolveCheckAuth;
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () =>
                new Promise(resolve => {
                    resolveCheckAuth = resolve;
                }),
        };
        render(<CustomLoading authProvider={authProvider} />);
        await screen.findByText('Please wait...');
        resolveCheckAuth(true);
        await screen.findByText('protected content');
    });
    it('shows nothing by default when users are denied access', async () => {
        let resolveCheckAuth;
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () =>
                new Promise(resolve => {
                    resolveCheckAuth = resolve;
                }),
        };
        const { container } = render(
            <AccessDenied authProvider={authProvider} />
        );
        expect(container.textContent).toEqual('');
        expect(screen.queryByText('protected content')).toBeNull();
        resolveCheckAuth(false);
        expect(container.textContent).toEqual('');
        expect(screen.queryByText('protected content')).toBeNull();
    });
    it('shows the custom accessDenied element when users are denied access', async () => {
        let resolveCheckAuth;
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () =>
                new Promise(resolve => {
                    resolveCheckAuth = resolve;
                }),
        };
        const { container } = render(
            <CustomAccessDenied authProvider={authProvider} />
        );
        expect(container.textContent).toEqual('');
        resolveCheckAuth(false);
        await screen.findByText('Not allowed');
    });
    it('shows the protected content when users are authorized', async () => {
        let resolveCheckAuth;
        const authProvider: AuthProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess: () =>
                new Promise(resolve => {
                    resolveCheckAuth = resolve;
                }),
        };
        const { container } = render(<Basic authProvider={authProvider} />);
        expect(container.textContent).toEqual('');
        resolveCheckAuth(true);
        await screen.findByText('protected content');
    });
    it('shows the protected content when no authProvider', () => {
        render(<NoAuthProvider />);
        screen.getByText('protected content');
    });
});
