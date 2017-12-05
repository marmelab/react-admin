export const USER_LOGIN = 'RA/USER_LOGIN';
export const USER_LOGIN_LOADING = 'RA/USER_LOGIN_LOADING';
export const USER_LOGIN_FAILURE = 'RA/USER_LOGIN_FAILURE';
export const USER_LOGIN_SUCCESS = 'RA/USER_LOGIN_SUCCESS';

export const userLogin = (payload, pathName) => ({
    type: USER_LOGIN,
    payload,
    meta: { auth: true, pathName },
});

export const USER_CHECK = 'RA/USER_CHECK';

export const userCheck = (payload, pathName) => ({
    type: USER_CHECK,
    payload,
    meta: { auth: true, pathName },
});

export const USER_LOGOUT = 'RA/USER_LOGOUT';

export const userLogout = () => ({
    type: USER_LOGOUT,
    meta: { auth: true },
});
