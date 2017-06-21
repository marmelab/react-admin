export const USER_LOGIN = 'AOR/USER_LOGIN';
export const USER_LOGIN_LOADING = 'AOR/USER_LOGIN_LOADING';
export const USER_LOGIN_FAILURE = 'AOR/USER_LOGIN_FAILURE';
export const USER_LOGIN_SUCCESS = 'AOR/USER_LOGIN_SUCCESS';

export const userLogin = (payload, pathName) => ({
    type: USER_LOGIN,
    payload,
    meta: { auth: true, pathName },
});

export const USER_CHECK = 'AOR/USER_CHECK';

export const userCheck = (payload, pathName) => ({
    type: USER_CHECK,
    payload,
    meta: { auth: true, pathName },
});

export const USER_LOGOUT = 'AOR/USER_LOGOUT';

export const userLogout = () => ({
    type: USER_LOGOUT,
    meta: { auth: true },
});
