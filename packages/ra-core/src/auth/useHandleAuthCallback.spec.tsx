import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { createMemoryHistory } from 'history';

import { useHandleAuthCallback } from './useHandleAuthCallback';
import AuthContext from './AuthContext';
import { useRedirect } from '../routing/useRedirect';
import useLogout from './useLogout';
import { AuthProvider } from '../types';

jest.mock('../routing/useRedirect');
jest.mock('./useLogout');

const redirect = jest.fn();
// @ts-ignore
useRedirect.mockImplementation(() => redirect);

const logout = jest.fn();
// @ts-ignore
useLogout.mockImplementation(() => logout);

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

const queryClient = new QueryClient();

describe('useHandleAuthCallback', () => {
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
                        handleCallback() {
                            return Promise.resolve({ redirectTo: '/test' });
                        },
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
                        handleCallback: () =>
                            Promise.reject(new Error('Custom Error')),
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <TestComponent customError />
                    </QueryClientProvider>
                </AuthContext.Provider>
            </HistoryRouter>
        );
        await waitFor(() => {
            screen.getByText('Custom Error');
        });
        expect(redirect).not.toHaveBeenCalledWith('/test');
    });
});
