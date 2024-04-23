import * as React from 'react';
import { useState, useEffect } from 'react';
import expect from 'expect';
import { screen, render, waitFor } from '@testing-library/react';
import { Location } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { useCheckAuth } from './useCheckAuth';
import { AuthContext } from './AuthContext';

import { BasenameContextProvider, TestMemoryRouter } from '../routing';
import { useNotify } from '../notification/useNotify';
import { AuthProvider } from '../types';

jest.mock('../notification/useNotify');

const notify = jest.fn();
useNotify.mockImplementation(() => notify);

const TestComponent = ({
    params,
    logoutOnFailure,
    redirectTo,
}: {
    params?: any;
    logoutOnFailure?: boolean;
    redirectTo?: string;
}) => {
    const [authenticated, setAuthenticated] = useState(true);
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, logoutOnFailure, redirectTo)
            .then(() => setAuthenticated(true))
            .catch(() => setAuthenticated(false));
    }, [params, logoutOnFailure, redirectTo, checkAuth]);
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

const queryClient = new QueryClient();

describe('useCheckAuth', () => {
    afterEach(() => {
        notify.mockClear();
    });

    it('should not logout if user is authenticated', async () => {
        let location: Location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent params={{ token: true }} />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('authenticated')).not.toBeNull();
            expect(location.pathname).toBe('/');
        });
    });

    it('should logout if user is not authenticated', async () => {
        let location: Location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent params={{ token: false }} />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(location.pathname).toBe('/login');
        });
    });

    it('should not logout if has no credentials and passed logoutOnFailure as false', async () => {
        let location: Location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent
                            params={{ token: false }}
                            logoutOnFailure={false}
                        />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('not authenticated')).not.toBeNull();
            expect(location.pathname).toBe('/');
        });
    });

    it('should logout without showing a notification when authProvider returns error with message false', async () => {
        let location: Location;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        checkAuth: () => Promise.reject({ message: false }),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(location.pathname).toBe('/login');
        });
    });

    it('should take basename into account when redirecting to login', async () => {
        let location: Location;
        render(
            <TestMemoryRouter
                initialEntries={['/foo']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <BasenameContextProvider basename="/foo">
                    <AuthContext.Provider value={authProvider}>
                        <QueryClientProvider client={queryClient}>
                            <TestComponent params={{ token: false }} />
                        </QueryClientProvider>
                    </AuthContext.Provider>
                </BasenameContextProvider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(location.pathname).toBe('/foo/login');
        });
    });
});
