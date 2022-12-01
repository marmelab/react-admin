import * as React from 'react';
import expect from 'expect';
import { screen, render, waitFor } from '@testing-library/react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { createMemoryHistory } from 'history';

import { useHandleLoginCallback } from './useHandleLoginCallback';
import AuthContext from './AuthContext';

import { BasenameContextProvider } from '../routing';
import { useRedirect } from '../routing/useRedirect';
import { AuthProvider } from '../types';

jest.mock('../routing/useRedirect');

const redirect = jest.fn();
// @ts-ignore
useRedirect.mockImplementation(() => redirect);

const TestComponent = ({ customError }: { customError?: boolean }) => {
    const [error, setError] = React.useState<string>();
    useHandleLoginCallback(
        customError
            ? {
                  onError: error => {
                      setError(error as string);
                  },
              }
            : undefined
    );
    return error ? <>{error}</> : null;
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
    handleLoginCallback: () => Promise.resolve(),
};

const queryClient = new QueryClient();

describe('useHandleLoginCallback', () => {
    afterEach(() => {
        redirect.mockClear();
    });

    it('should redirect to the home route by default when the callback was successfully handled', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={queryClient}>
                        <TestComponent />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/');
        });
    });

    it('should redirect to the provided route when the callback was successfully handled', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleLoginCallback: () =>
                            Promise.resolve({ redirectTo: '/test' }),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/test');
        });
    });

    it('should redirect to the home route by default when the callback was not successfully handled', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleLoginCallback: () => Promise.reject(),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/');
        });
    });

    it('should redirect to the provided route when the callback was not successfully handled', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleLoginCallback: () =>
                            Promise.reject({ redirectTo: '/test' }),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/test');
        });
    });

    it('should use custom useQuery options such as onError', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <HistoryRouter history={history}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleLoginCallback: () =>
                            Promise.resolve({ redirectTo: '/test' }),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent customError />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/test');
        });
    });

    it('should take basename into account when redirecting to home route', async () => {
        const history = createMemoryHistory({ initialEntries: ['/foo'] });
        render(
            <HistoryRouter history={history}>
                <BasenameContextProvider basename="/foo">
                    <AuthContext.Provider value={authProvider}>
                        <QueryClientProvider client={queryClient}>
                            <TestComponent />
                        </QueryClientProvider>
                    </AuthContext.Provider>
                </BasenameContextProvider>
            </HistoryRouter>
        );
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/foo/');
        });
    });
});
