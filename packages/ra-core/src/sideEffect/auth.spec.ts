import expect from 'expect';
import { runSaga } from 'redux-saga';
import {
    handleLogin,
    handleCheck,
    handleLogout,
    handleFetchError,
} from './auth';
import {
    USER_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
} from '../actions/authActions';
import { push, replace } from 'connected-react-router';
import {
    showNotification,
    hideNotification,
} from '../actions/notificationActions';
import { clearState } from '../actions/clearActions';
import { waitFor } from '@testing-library/react';

describe('Auth saga', () => {
    describe('Login saga', () => {
        test('Handle successful login', async () => {
            const dispatch = jest.fn();
            const authProvider = {
                login: jest.fn().mockResolvedValue({ role: 'admin' }),
                logout: () => Promise.reject('bad method'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    login: 'user',
                    password: 'password123',
                },
                meta: {
                    pathName: '/posts',
                },
            };

            await runSaga({ dispatch }, handleLogin(authProvider), action);
            expect(authProvider.login).toHaveBeenCalledWith({
                login: 'user',
                password: 'password123',
            });
            expect(dispatch).toHaveBeenCalledWith({ type: USER_LOGIN_LOADING });
            expect(dispatch).toHaveBeenCalledWith({
                type: USER_LOGIN_SUCCESS,
                payload: { role: 'admin' },
            });
            expect(dispatch).toHaveBeenCalledWith(push('/posts'));
        });

        test('Handle successful login with redirection from previous state', async () => {
            const dispatch = jest.fn();
            const authProvider = {
                login: jest.fn().mockResolvedValue({ role: 'admin' }),
                logout: () => Promise.reject('bad method'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    login: 'user',
                    password: 'password123',
                },
                meta: {},
            };

            await runSaga(
                {
                    dispatch,
                    getState: () => ({
                        router: {
                            location: { state: { nextPathname: '/posts/1' } },
                        },
                    }),
                },
                handleLogin(authProvider),
                action
            );

            expect(authProvider.login).toHaveBeenCalledWith({
                login: 'user',
                password: 'password123',
            });
            expect(dispatch).toHaveBeenCalledWith({ type: USER_LOGIN_LOADING });
            expect(dispatch).toHaveBeenCalledWith({
                type: USER_LOGIN_SUCCESS,
                payload: { role: 'admin' },
            });
            expect(dispatch).toHaveBeenCalledWith(push('/posts/1'));
        });

        test('Handle failed login', async () => {
            const dispatch = jest.fn();
            const error = { message: 'Bazinga!' };
            const authProvider = {
                login: jest.fn().mockRejectedValue(error),
                logout: () => Promise.reject('bad method'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    login: 'user',
                    password: 'password123',
                },
                meta: {
                    pathName: '/posts',
                },
            };

            await runSaga({ dispatch }, handleLogin(authProvider), action);
            expect(authProvider.login).toHaveBeenCalledWith({
                login: 'user',
                password: 'password123',
            });
            expect(dispatch).toHaveBeenCalledWith({ type: USER_LOGIN_LOADING });
            expect(dispatch).toHaveBeenCalledWith({
                type: USER_LOGIN_FAILURE,
                error,
                meta: { auth: true },
            });
            expect(dispatch).toHaveBeenCalledWith(
                showNotification('Bazinga!', 'warning')
            );
        });
    });
    describe('Check saga', () => {
        test('Handle successful check', async () => {
            const dispatch = jest.fn();
            const authProvider = {
                login: () => Promise.reject('bad method'),
                logout: () => Promise.reject('bad method'),
                checkAuth: jest.fn().mockResolvedValue({ role: 'admin' }),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    resource: 'posts',
                },
                meta: {
                    pathName: '/posts',
                },
            };

            await runSaga({ dispatch }, handleCheck(authProvider), action);
            expect(authProvider.checkAuth).toHaveBeenCalledWith({
                resource: 'posts',
            });
            expect(dispatch).not.toHaveBeenCalled();
        });

        test('Handle failed check', async () => {
            const dispatch = jest.fn();
            const error = { message: 'Bazinga!' };
            const authProvider = {
                login: () => Promise.reject('bad method'),
                logout: jest.fn().mockResolvedValueOnce('/custom'),
                checkAuth: jest.fn().mockRejectedValueOnce(error),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    resource: 'posts',
                },
                meta: {
                    pathName: '/posts',
                },
            };

            await runSaga({ dispatch }, handleCheck(authProvider), action);
            expect(authProvider.checkAuth).toHaveBeenCalledWith({
                resource: 'posts',
            });
            expect(authProvider.logout).toHaveBeenCalled();
            await waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(
                    replace({
                        pathname: '/custom',
                        state: { nextPathname: '/posts' },
                    })
                );
                expect(dispatch).toHaveBeenCalledWith(clearState());
                expect(dispatch).toHaveBeenCalledWith(
                    showNotification('Bazinga!', 'warning')
                );
            });
        });
    });
    describe('Logout saga', () => {
        test('Handle logout', async () => {
            const dispatch = jest.fn();
            const authProvider = {
                login: () => Promise.reject('bad method'),
                logout: jest.fn().mockResolvedValueOnce('/custom'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: () => Promise.reject('bad method'),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                payload: {
                    resource: 'posts',
                },
                meta: {
                    pathName: '/posts',
                },
            };

            await runSaga({ dispatch }, handleLogout(authProvider), action);
            expect(authProvider.logout).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith(push('/custom'));
            expect(dispatch).toHaveBeenCalledWith(clearState());
        });
    });
    describe('Fetch error saga', () => {
        test('Handle errors when authProvider throws', async () => {
            const dispatch = jest.fn();
            const error = { message: 'Bazinga!' };
            const authProvider = {
                login: () => Promise.reject('bad method'),
                logout: jest.fn().mockResolvedValueOnce('/custom'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: jest.fn().mockRejectedValueOnce(undefined),
                getPermissions: () => Promise.reject('bad method'),
            };
            const action = {
                error,
            };

            await runSaga(
                {
                    dispatch,
                    getState: () => ({ router: { location: '/posts' } }),
                },
                handleFetchError(authProvider),
                action
            );
            expect(authProvider.checkError).toHaveBeenCalledWith(error);
            expect(authProvider.logout).toHaveBeenCalled();
            await waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith(
                    push({
                        pathname: '/custom',
                        state: { nextPathname: '/posts' },
                    })
                );
                expect(dispatch).toHaveBeenCalledWith(hideNotification());
                expect(dispatch).toHaveBeenCalledWith(
                    showNotification('ra.notification.logged_out', 'warning')
                );
                expect(dispatch).toHaveBeenCalledWith(clearState());
            });
        });
    });
});
