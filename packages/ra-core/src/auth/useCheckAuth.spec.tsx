import * as React from 'react';
import { useState, useEffect } from 'react';
import expect from 'expect';
import { screen, render, waitFor } from '@testing-library/react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { createMemoryHistory } from 'history';

import { useCheckAuth } from './useCheckAuth';
import AuthContext from './AuthContext';

import { BasenameContextProvider } from '../routing';
import { useNotify } from '../notification/useNotify';
import { AuthProvider } from '../types';

jest.mock('../notification/useNotify');

const notify = jest.fn();
useNotify.mockImplementation(() => notify);

const TestComponent = ({
    params,
    logoutOnFailure,
    redirectTo,
    disableNotification,
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
            .catch(() => setAuthenticated(false));
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

const queryClient = new QueryClient();

describe('useCheckAuth', () => {
    afterEach(() => {
        notify.mockClear();
    });

    it('should not logout if user is authenticated', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent params={{ token: true }} />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('authenticated')).not.toBeNull();
            expect(history.location.pathname).toBe('/');
        });
    });

    it('should logout if user is not authenticated', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent params={{ token: false }} />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(history.location.pathname).toBe('/login');
        });
    });

    it('should not logout if has no credentials and passed logoutOnFailure as false', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent
                            params={{ token: false }}
                            logoutOnFailure={false}
                        />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('not authenticated')).not.toBeNull();
            expect(history.location.pathname).toBe('/');
        });
    });

    it('should logout without showing a notification when disableNotification is true', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent
                            params={{ token: false }}
                            disableNotification
                        />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(history.location.pathname).toBe('/login');
        });
    });

    it('should logout without showing a notification when authProvider returns error with message false', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
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
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(history.location.pathname).toBe('/login');
        });
    });

    it('should take basename into account when redirecting to login', async () => {
        const history = createMemoryHistory({ initialEntries: ['/foo'] });
        render(
            <HistoryRouter history={history}>
                <BasenameContextProvider basename="/foo">
                    <AuthContext.Provider value={authProvider}>
                        <QueryClientProvider client={queryClient}>
                            <TestComponent params={{ token: false }} />
                        </QueryClientProvider>
                    </AuthContext.Provider>
                </BasenameContextProvider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('authenticated')).toBeNull();
            expect(history.location.pathname).toBe('/foo/login');
        });
    });
});
