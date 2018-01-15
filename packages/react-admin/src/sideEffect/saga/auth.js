import { all, put, call, select, takeEvery } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';

import {
    showNotification,
    hideNotification,
} from '../../actions/notificationActions';
import {
    USER_LOGIN,
    USER_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_CHECK,
    USER_LOGOUT,
} from '../../actions/authActions';
import {
    FETCH_ERROR,
    FETCH_ERROR_REJECTED,
    FETCH_ERROR_RESOLVED,
} from '../../actions/fetchActions';
import { AUTH_LOGIN, AUTH_CHECK, AUTH_ERROR, AUTH_LOGOUT } from '../../auth';
const nextPathnameSelector = state => {
    const locationState = state.routing.location.state;
    return locationState && locationState.nextPathname;
};
export default authClient => {
    if (!authClient) return () => null;
    function* handleAuth(action) {
        const { type, payload, error, meta } = action;
        switch (type) {
            case USER_LOGIN: {
                try {
                    yield put({ type: USER_LOGIN_LOADING });
                    const authPayload = yield call(
                        authClient,
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
                    yield call(authClient, AUTH_CHECK, payload);
                } catch (error) {
                    yield call(authClient, AUTH_LOGOUT);
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
                yield put(push('/login'));
                yield call(authClient, AUTH_LOGOUT);
                break;
            }
            case FETCH_ERROR:
                try {
                    yield call(authClient, AUTH_ERROR, error);
                    yield put({
                        type: FETCH_ERROR_RESOLVED,
                    });
                } catch (e) {
                    yield put({
                        type: FETCH_ERROR_REJECTED,
                    });
                    yield call(authClient, AUTH_LOGOUT);
                    yield put(push('/login'));
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
