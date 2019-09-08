import React from 'react';
import expect from 'expect';
import { render, cleanup, wait } from '@testing-library/react';

import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import AuthContext from './AuthContext';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';

jest.mock('./useLogout');
jest.mock('../sideEffect/useNotify');

const TestComponent = ({ error }: { error?: any }) => {
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    logoutIfAccessDenied(error);
    return <div>rendered</div>;
};

const authProvider = (type, params) =>
    new Promise((resolve, reject) => {
        if (type !== 'AUTH_ERROR') reject('bad method');
        if (params instanceof Error && params.message == 'denied') {
            reject(new Error('logout'));
        }
        resolve();
    });

describe('useLogoutIfAccessDenied', () => {
    afterEach(cleanup);
    it('should not logout if passed no error', async () => {
        const logout = jest.fn();
        useLogout.mockImplementationOnce(() => logout);
        const notify = jest.fn();
        useNotify.mockImplementationOnce(() => notify);
        render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should not log out if passed an error that does not make the authProvider throw', async () => {
        const logout = jest.fn();
        useLogout.mockImplementationOnce(() => logout);
        const notify = jest.fn();
        useNotify.mockImplementationOnce(() => notify);
        render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error()} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(0);
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should logout if passed an error that makes the authProvider throw', async () => {
        const logout = jest.fn();
        useLogout.mockImplementationOnce(() => logout);
        const notify = jest.fn();
        useNotify.mockImplementationOnce(() => notify);
        render(
            <AuthContext.Provider value={authProvider}>
                <TestComponent error={new Error('denied')} />
            </AuthContext.Provider>
        );
        await wait();
        expect(logout).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledTimes(1);
    });
});
