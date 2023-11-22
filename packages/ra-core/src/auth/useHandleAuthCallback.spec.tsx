import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import {
    unstable_HistoryRouter as HistoryRouter,
    Route,
    Routes,
} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryHistory } from 'history';

import { useHandleAuthCallback } from './useHandleAuthCallback';
import AuthContext from './AuthContext';
import { AuthProvider } from '../types';

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
    handleCallback: () => Promise.resolve({}),
};

describe('useHandleAuthCallback', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to the home route by default when the callback was successfully handled', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/auth-callback'],
        });
        render(
            <HistoryRouter history={history}>
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
            </HistoryRouter>
        );
        await screen.findByText('Home');
    });

    it('should redirect to the provided route when the callback was successfully handled', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/auth-callback'],
        });
        render(
            <HistoryRouter history={history}>
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
            </HistoryRouter>
        );
        await screen.findByText('Test');
    });

    it('should use custom useQuery options such as onError', async () => {
        const history = createMemoryHistory({
            initialEntries: ['/auth-callback'],
        });
        render(
            <HistoryRouter history={history}>
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
            </HistoryRouter>
        );
        await waitFor(() => {
            screen.getByText('Custom Error');
        });
        expect(screen.queryByText('Home')).toBeNull();
    });
});
