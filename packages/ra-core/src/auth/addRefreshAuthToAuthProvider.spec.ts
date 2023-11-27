import { waitFor } from '@testing-library/react';
import { AuthProvider } from '../types';
import { addRefreshAuthToAuthProvider } from './addRefreshAuthToAuthProvider';

describe('addRefreshAuthToAuthProvider', () => {
    const authProvider: AuthProvider = {
        login: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        checkError: jest.fn(),
        getIdentity: jest.fn(),
        getPermissions: jest.fn(),
    };

    it('should call refreshAuth before calling checkAuth', async () => {
        let resolvePromise;
        const refreshAuthPromise = new Promise<void>(resolve => {
            resolvePromise = resolve;
        });
        const refreshAuth = jest.fn(() => refreshAuthPromise);

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        wrappedAuthProvider.checkAuth({});
        expect(refreshAuth).toHaveBeenCalled();
        expect(authProvider.checkAuth).not.toHaveBeenCalled();
        resolvePromise();
        await waitFor(() => {
            expect(authProvider.checkAuth).toHaveBeenCalled();
        });
    });

    it('should call refreshAuth before calling getIdentity', async () => {
        let resolvePromise;
        const refreshAuthPromise = new Promise<void>(resolve => {
            resolvePromise = resolve;
        });
        const refreshAuth = jest.fn(() => refreshAuthPromise);

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        // @ts-ignore
        wrappedAuthProvider.getIdentity();
        expect(refreshAuth).toHaveBeenCalled();
        expect(authProvider.getIdentity).not.toHaveBeenCalled();
        resolvePromise();
        await waitFor(() => {
            expect(authProvider.getIdentity).toHaveBeenCalled();
        });
    });

    it('should not provide getIdentity if getIdentity is not implemented in the authProvider', async () => {
        const authProvider: AuthProvider = {
            login: jest.fn(),
            logout: jest.fn(),
            checkAuth: jest.fn(),
            checkError: jest.fn(),
            getPermissions: jest.fn(),
        };

        const refreshAuth = jest.fn();
        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );

        expect(wrappedAuthProvider.getIdentity).toBeUndefined();
    });

    it('should call refreshAuth before calling getPermissions', async () => {
        let resolvePromise;
        const refreshAuthPromise = new Promise<void>(resolve => {
            resolvePromise = resolve;
        });
        const refreshAuth = jest.fn(() => refreshAuthPromise);

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        wrappedAuthProvider.getPermissions({});
        expect(refreshAuth).toHaveBeenCalled();
        expect(authProvider.getPermissions).not.toHaveBeenCalled();
        resolvePromise();
        await waitFor(() => {
            expect(authProvider.getPermissions).toHaveBeenCalled();
        });
    });

    it('should not call refreshAuth before calling login', async () => {
        const refreshAuth = jest.fn();

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        wrappedAuthProvider.login({});
        expect(refreshAuth).not.toHaveBeenCalled();
        expect(authProvider.login).toHaveBeenCalled();
    });

    it('should not call refreshAuth before calling logout', async () => {
        const refreshAuth = jest.fn();

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        wrappedAuthProvider.logout({});
        expect(refreshAuth).not.toHaveBeenCalled();
        expect(authProvider.logout).toHaveBeenCalled();
    });

    it('should not call refreshAuth before calling checkError', async () => {
        const refreshAuth = jest.fn();

        const wrappedAuthProvider = addRefreshAuthToAuthProvider(
            authProvider,
            refreshAuth
        );
        wrappedAuthProvider.checkError({});
        expect(refreshAuth).not.toHaveBeenCalled();
        expect(authProvider.checkError).toHaveBeenCalled();
    });
});
