import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { useHandleAuthCallback } from './useHandleAuthCallback';
import { AuthContext } from './AuthContext';
import { AuthProvider } from '../types';

import { TestMemoryRouter } from '../routing';

const TestComponent = ({ customError }: { customError?: boolean }) => {
    const [error, setError] = React.useState<string>();
    useHandleAuthCallback(
        customError
            ? {
                  onError: error => {
                      setError((error as Error).message);
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
            return Promise.reject(new Error('Custom Error'));
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.reject('not authenticated'),
    handleCallback: () => Promise.resolve(),
};

describe('useHandleAuthCallback', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to the home route by default when the callback was successfully handled', async () => {
        render(
            <TestMemoryRouter initialEntries={['/auth-callback']}>
                <AuthContext.Provider value={authProvider}>
                    <QueryClientProvider client={new QueryClient()}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/test" element={<div>Test</div>} />
                            <Route
                                path="/auth-callback"
                                element={<TestComponent />}
                            />
                        </Routes>
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await screen.findByText('Home');
    });

    it('should redirect to the provided route when the callback was successfully handled', async () => {
        render(
            <TestMemoryRouter initialEntries={['/auth-callback']}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleCallback() {
                            return Promise.resolve({ redirectTo: '/test' });
                        },
                    }}
                >
                    <QueryClientProvider client={new QueryClient()}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/test" element={<div>Test</div>} />
                            <Route
                                path="/auth-callback"
                                element={<TestComponent />}
                            />
                        </Routes>
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await screen.findByText('Test');
    });

    it('should use custom useQuery options such as onError', async () => {
        render(
            <TestMemoryRouter initialEntries={['/auth-callback']}>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        handleCallback: () =>
                            Promise.reject(new Error('Custom Error')),
                    }}
                >
                    <QueryClientProvider client={new QueryClient()}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route
                                path="/auth-callback"
                                element={<TestComponent customError />}
                            />
                        </Routes>
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            screen.getByText('Custom Error');
        });
        expect(screen.queryByText('Home')).toBeNull();
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const testAuthProvider = {
            ...authProvider,
            handleCallback: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        };
        const queryClient = new QueryClient();
        render(
            <TestMemoryRouter initialEntries={['/auth-callback']}>
                <AuthContext.Provider value={testAuthProvider}>
                    <QueryClientProvider client={queryClient}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/test" element={<div>Test</div>} />
                            <Route
                                path="/auth-callback"
                                element={<TestComponent />}
                            />
                        </Routes>
                    </QueryClientProvider>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(testAuthProvider.handleCallback).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'handleCallback'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
