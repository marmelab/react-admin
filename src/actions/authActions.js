export const USER_LOGIN = 'admin-on-rest/USER_LOGIN';
export const USER_LOGIN_LOADING = 'admin-on-rest/USER_LOGIN_LOADING';
export const USER_LOGIN_FAILURE = 'admin-on-rest/USER_LOGIN_FAILURE';
export const USER_LOGIN_SUCCESS = 'admin-on-rest/USER_LOGIN_SUCCESS';

export const userLogin = (payload, pathName) => ({
    type: USER_LOGIN,
    payload,
    meta: { auth: true, pathName },
});

export const USER_CHECK = 'USER_CHECK';

export const userCheck = (payload, pathName) => ({
    type: USER_CHECK,
    payload,
    meta: { auth: true, pathName },
});

export const USER_LOGOUT = 'USER_LOGOUT';

export const userLogout = () => ({
    type: USER_LOGOUT,
    meta: { auth: true },
});
