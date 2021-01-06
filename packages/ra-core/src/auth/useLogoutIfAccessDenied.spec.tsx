import * as React from 'react';
import { useState, useEffect } from 'react';
import expect from 'expect';
import { render, cleanup, wait } from '@testing-library/react';

import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import AuthContext from './AuthContext';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';
import { AuthProvider } from '../types';

jest.mock('./useLogout');
jest.mock('../sideEffect/useNotify');

const logout = jest.fn();
useLogout.mockImplementation(() => logout);
const notify = jest.fn();
useNotify.mockImplementation(() => notify);

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

let loggedIn = true;

const authProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => {
        loggedIn = false;
        return Promise.resolve();
    },
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

describe('useLogoutIfAccessDenied', () => {
    afterEach(() => {
        logout.mockClear();
        notify.mockClear();
        cleanup();
    });

    it('should not logout if passed no error', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).not.toBeNull();
    });

    it('should not log out if passed an error that does not make the authProvider throw', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error()} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).not.toBeNull();
    });

    it('should logout if passed an error that makes the authProvider throw', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(1);
        expect(queryByText('logged in')).toBeNull();
    });

    it('should not send multiple notifications if already logged out', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(1);
        expect(queryByText('logged in')).toBeNull();
    });

    it('should logout without showing a notification if disableAuthentication is true', async () => {
        const { queryByText } = render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent
                    error={new Error('denied')}
                    disableNotification
                />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).toBeNull();
    });

    it('should logout without showing a notification if authProvider returns error with message false', async () => {
        const { queryByText } = render(
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
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(0);
        expect(queryByText('logged in')).toBeNull();
    });
});
