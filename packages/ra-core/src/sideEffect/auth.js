import { all, put, call, select, takeEvery } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';

import {
    showNotification,
    hideNotification,
} from '../actions/notificationActions';
import {
    USER_LOGIN,
    USER_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_CHECK,
    USER_LOGOUT,
} from '../actions/authActions';
import { FETCH_ERROR } from '../actions/fetchActions';
import { AUTH_LOGIN, AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from '../auth';
const nextPathnameSelector = state => {
    const locationState = state.router.location.state;
    return locationState && locationState.nextPathname;
};

const currentPathnameSelector = state => state.router.location;

export default authProvider => {
    if (!authProvider) return () => null;
    function* handleAuth(action) {
        const { type, payload, error, meta } = action;
        switch (type) {
            case USER_LOGIN: {
                try {
                    yield put({ type: USER_LOGIN_LOADING });
                    const authPayload = yield call(
                        authProvider,
                        AUTH_LOGIN,
                        payload
                    );
                    yield put({
                        type: USER_LOGIN_SUCCESS,
                        payload: authPayload,
                    });
                    const redirectTo = yield meta.pathName ||
                        select(nextPathnameSelector);
                    yield put(push(redirectTo || '/'));
                } catch (e) {
                    yield put({
                        type: USER_LOGIN_FAILURE,
                        error: e,
                        meta: { auth: true },
                    });
                    const errorMessage =
                        typeof e === 'string'
                            ? e
                            : typeof e === 'undefined' || !e.message
                                ? 'ra.auth.sign_in_error'
                                : e.message;
                    yield put(showNotification(errorMessage, 'warning'));
                }
                break;
            }
            case USER_CHECK: {
                try {
                    yield call(authProvider, AUTH_CHECK, payload);
                } catch (error) {
                    yield call(authProvider, AUTH_LOGOUT);
                    yield put(
                        replace({
                            pathname: (error && error.redirectTo) || '/login',
                            state: { nextPathname: meta.pathName },
                        })
                    );
                }
                break;
            }
            case USER_LOGOUT: {
                yield put(
                    push(
                        (action.payload && action.payload.redirectTo) ||
                            '/login'
                    )
                );
                yield call(authProvider, AUTH_LOGOUT);
                break;
            }
            case FETCH_ERROR:
                try {
                    yield call(authProvider, AUTH_ERROR, error);
                } catch (e) {
                    const nextPathname = yield select(currentPathnameSelector);
                    yield call(authProvider, AUTH_LOGOUT);
                    yield put(
                        push({
                            pathname: '/login',
                            state: { nextPathname },
                        })
                    );
                    yield put(hideNotification());
                }
                break;
        }
    }
    return function* watchAuthActions() {
        yield all([
            takeEvery(action => action.meta && action.meta.auth, handleAuth),
            takeEvery(FETCH_ERROR, handleAuth),
        ]);
    };
};
