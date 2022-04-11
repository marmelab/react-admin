import * as React from 'react';
import { useState, useEffect } from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { Route, MemoryRouter } from 'react-router-dom';

import { useCheckAuth } from './useCheckAuth';
import AuthContext from './AuthContext';
import useLogout from './useLogout';
import { useNotify } from '../notification/useNotify';
import { AuthProvider } from '../types';
import { defaultAuthParams } from './useAuthProvider';
import { CoreAdminContext } from '../core/CoreAdminContext';
import { CustomRoutes, Resource } from '../core';

jest.mock('./useLogout');
jest.mock('../notification/useNotify');

const logout = jest.fn();
useLogout.mockImplementation(() => logout);
const notify = jest.fn();
useNotify.mockImplementation(() => notify);

const defaultParams = {};

const TestComponent = ({
    params = defaultParams,
    logoutOnFailure = true,
    redirectTo = defaultAuthParams.loginUrl,
    disableNotification = false,
}: {
    params?: any;
    logoutOnFailure?: boolean;
    redirectTo?: string;
    disableNotification?: boolean;
}) => {
    const [authenticated, setAuthenticated] = useState(true);
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, logoutOnFailure, redirectTo, disableNotification)
            .then(() => setAuthenticated(true))
            .catch(error => setAuthenticated(false));
    }, [params, logoutOnFailure, redirectTo, disableNotification, checkAuth]);
    return <div>{authenticated ? 'authenticated' : 'not authenticated'}</div>;
};

const authProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => {
        return Promise.resolve();
    },
    checkAuth: params => (params.token ? Promise.resolve() : Promise.reject()),
    checkError: params => {
        if (params instanceof Error && params.message === 'denied') {
            return Promise.reject(new Error('logout'));
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.reject('not authenticated'),
};

const TestWrapper = ({ children }) => {
    return (
        <MemoryRouter>
            <CoreAdminContext authProvider={authProvider}>
                <CustomRoutes noLayout>
                    <Route path="/login" element={<i>Login</i>} />
                </CustomRoutes>
                <Resource name="posts" list={() => <>{children}</>} />
            </CoreAdminContext>
        </MemoryRouter>
    );
};

describe('useCheckAuth', () => {
    afterEach(() => {
        logout.mockClear();
        notify.mockClear();
    });

    it('should not logout if has credentials', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent params={{ token: true }} />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('authenticated')).not.toBeNull();
        });
    });

    it('should logout if has no credentials', async () => {
        const { queryByText } = render(
            <TestWrapper>
                <TestComponent params={{ token: false }} />
            </TestWrapper>
        );
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(queryByText('authenticated')).toBeNull();
        });
        await waitFor(() => {
            expect(queryByText('Login')).not.toBeNull();
        });
    });

    it('should not logout if has no credentials and passed logoutOnFailure as false', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent
                    params={{ token: false }}
                    logoutOnFailure={false}
                />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('not authenticated')).not.toBeNull();
        });
    });

    it('should logout without showing a notification when disableNotification is true', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent params={{ token: false }} disableNotification />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('authenticated')).toBeNull();
        });
    });

    it('should logout without showing a notification when authProvider returns error with message false', async () => {
        const { queryByText } = render(
            <AuthContext.Provider
                value={{
                    ...authProvider,
                    checkAuth: () => Promise.reject({ message: false }),
                }}
            >
                <TestComponent />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('authenticated')).toBeNull();
        });
    });
});
