import * as React from 'react';
import { useState, useEffect } from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import AuthContext from './AuthContext';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';
import { AuthProvider } from '../types';

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
        if (params instanceof Error && params.message === 'denied') {
            return Promise.reject(new Error('logout'));
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.reject('bad method'),
};

const TestComponent = ({
    error,
    disableNotification,
}: {
    error?: any;
    disableNotification?: boolean;
}) => {
    const [loggedOut, setLoggedOut] = useState(false);
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    useEffect(() => {
        logoutIfAccessDenied(error, disableNotification).then(setLoggedOut);
    }, [error, disableNotification, logoutIfAccessDenied]);
    return <div>{loggedOut ? '' : 'logged in'}</div>;
};

jest.mock('./useLogout');
jest.mock('../sideEffect/useNotify');

//@ts-expect-error
useLogout.mockImplementation(() => {
    const logout = () => authProvider.logout(null);
    return logout;
});
const notify = jest.fn();
//@ts-expect-error
useNotify.mockImplementation(() => notify);

function renderInRouter(children) {
    const history = createMemoryHistory();
    const api = render(<Router history={history}>{children}</Router>);

    return {
        ...api,
        history,
    };
}

describe('useLogoutIfAccessDenied', () => {
    afterEach(() => {
        //@ts-expect-error
        authProvider.logout.mockClear();
        notify.mockClear();
        authProvider.login('');
    });

    it('should not logout if passed no error', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={authProvider}>
                <TestComponent />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('logged in')).not.toBeNull();
        });
    });

    it('should not log out if passed an error that does not make the authProvider throw', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error()} />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('logged in')).not.toBeNull();
        });
    });

    it('should logout if passed an error that makes the authProvider throw', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(queryByText('logged in')).toBeNull();
        });
    });

    it('should not send multiple notifications if already logged out', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(queryByText('logged in')).toBeNull();
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
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={delayedAuthProvider}>
                <TestComponent />
                <TestComponent />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(2); /// two logouts, but only one notification
            expect(notify).toHaveBeenCalledTimes(1);
            expect(queryByText('logged in')).toBeNull();
        });
    });

    it('should logout without showing a notification if disableAuthentication is true', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider value={authProvider}>
                <TestComponent
                    error={new Error('denied')}
                    disableNotification
                />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('logged in')).toBeNull();
        });
    });

    it('should logout without showing a notification if authProvider returns error with message false', async () => {
        const { queryByText } = renderInRouter(
            <AuthContext.Provider
                value={{
                    ...authProvider,
                    checkError: () => {
                        return Promise.reject({ message: false });
                    },
                }}
            >
                <TestComponent />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(1);
            expect(notify).toHaveBeenCalledTimes(0);
            expect(queryByText('logged in')).toBeNull();
        });
    });

    it('should not logout the user if logoutUser is set to false', async () => {
        const { queryByText, history } = renderInRouter(
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
                <TestComponent />
            </AuthContext.Provider>
        );
        await waitFor(() => {
            expect(authProvider.logout).toHaveBeenCalledTimes(0);
            expect(notify).toHaveBeenCalledTimes(1);
            expect(queryByText('logged in')).toBeNull();
            expect(history.location.pathname).toBe('/unauthorized');
        });
    });
});
