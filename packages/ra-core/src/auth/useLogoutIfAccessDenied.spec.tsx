import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { AuthContext } from './AuthContext';
import useLogout from './useLogout';
import { useNotify } from '../notification/useNotify';
import { AuthProvider } from '../types';
import { useSafeSetState } from '../util';

import { TestMemoryRouter } from '../routing';

let loggedIn = true;

const authProvider: AuthProvider = {
    login: () => {
        loggedIn = true;
        return Promise.resolve();
    },
    logout: jest.fn(() => {
        loggedIn = false;
        return Promise.resolve();
    }),
    checkAuth: () =>
        loggedIn ? Promise.resolve() : Promise.reject('bad method'),
    checkError: params => {
        if (params instanceof Error) {
            return Promise.reject(
                new Error(
                    params.message === 'denied' ? 'logout' : params.message
                )
            );
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.reject('bad method'),
};

const TestComponent = ({ error }: { error?: any }) => {
    const [loggedOut, setLoggedOut] = useSafeSetState(false);
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    useEffect(() => {
        logoutIfAccessDenied(error).then(setLoggedOut);
    }, [error, logoutIfAccessDenied, setLoggedOut]);
    return <div>{loggedOut ? '' : 'logged in'}</div>;
};

jest.mock('./useLogout');
jest.mock('../notification/useNotify');

//@ts-expect-error
useLogout.mockImplementation(() => {
    const logout = () => authProvider.logout(null);
    return logout;
});
const notify = jest.fn();
//@ts-expect-error
useNotify.mockImplementation(() => notify);

const TestWrapper = ({ children }) => (
    <TestMemoryRouter>
        <AuthContext.Provider value={authProvider}>
            <Routes>{children}</Routes>
        </AuthContext.Provider>
    </TestMemoryRouter>
);

describe('useLogoutIfAccessDenied', () => {
    afterEach(() => {
        //@ts-expect-error
        authProvider.logout.mockClear();
        notify.mockClear();
        authProvider.login('');
    });

    it('should not log out if passed an error that does not make the authProvider throw', async () => {
        render(
            <Route path="/" element={<TestComponent error={new Error()} />} />,
            {
                wrapper: TestWrapper,
            }
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('logged in')).not.toBeNull();
        });
    });

    it('should logout if passed an error that makes the authProvider throw', async () => {
        render(
            <Route
                path="/"
                element={<TestComponent error={new Error('denied')} />}
            />,
            {
                wrapper: TestWrapper,
            }
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('logged in')).toBeNull();
        });
    });

    it('should not send multiple notifications if already logged out', async () => {
        render(
            <Route
                path="/"
                element={
                    <>
                        <TestComponent error={new Error('denied')} />
                        <TestComponent error={new Error('denied')} />
                    </>
                }
            />,
            {
                wrapper: TestWrapper,
            }
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('logged in')).toBeNull();
        });
    });

    it('should not send multiple notifications if the errors arrive with a delay', async () => {
        let index = 0;
        const delayedAuthProvider = {
            ...authProvider,
            checkError: () =>
                new Promise<void>((resolve, reject) => {
                    setTimeout(() => reject(new Error('foo')), index * 100);
                    index++; // answers immediately first, then after 100ms the second time
                }),
        };
        render(
            <TestMemoryRouter>
                <AuthContext.Provider value={delayedAuthProvider}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <TestComponent />
                                    <TestComponent />
                                </>
                            }
                        />
                    </Routes>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(2); /// two logouts, but only one notification
        });
        expect(notify).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('logged in')).toBeNull();
    });

    it('should logout without showing a notification if authProvider returns error with message false', async () => {
        render(
            <TestMemoryRouter>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        checkError: () => {
                            return Promise.reject({ message: false });
                        },
                    }}
                >
                    <Routes>
                        <Route path="/" element={<TestComponent />} />
                    </Routes>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(screen.queryByText('logged in')).toBeNull();
        });
    });

    it('should logout without showing a notification if it has been called with error param', async () => {
        render(
            <Route
                path="/"
                element={<TestComponent error={new Error('Error')} />}
            />,
            {
                wrapper: TestWrapper,
            }
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
        });
    });

    it('should notify if passed an error with a message that makes the authProvider throw', async () => {
        render(
            <Route
                path="/"
                element={<TestComponent error={new Error('Test message')} />}
            />,
            {
                wrapper: TestWrapper,
            }
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(notify.mock.calls[0][0]).toEqual('Test message');
            expect(screen.queryByText('logged in')).toBeNull();
        });
    });

    it('should not logout the user if logoutUser is set to false', async () => {
        render(
            <TestMemoryRouter>
                <AuthContext.Provider
                    value={{
                        ...authProvider,
                        checkError: () => {
                            return Promise.reject({
                                logoutUser: false,
                                redirectTo: '/unauthorized',
                            });
                        },
                    }}
                >
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <TestComponent />
                                </>
                            }
                        />
                        <Route
                            path="/unauthorized"
                            element={<p>unauthorized</p>}
                        />
                    </Routes>
                </AuthContext.Provider>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('logged in')).toBeNull();
            expect(screen.queryByText('unauthorized')).not.toBeNull();
        });
    });
});
