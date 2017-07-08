import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest'; // eslint-disable-line import/no-unresolved

// Authenticatd by default
export default (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        if (username === 'login' && password === 'password') {
            localStorage.removeItem('not_authenticated');
            return Promise.resolve();
        }
        localStorage.setItem('not_authenticated', true);
        return Promise.reject();
    }
    if (type === AUTH_LOGOUT) {
        localStorage.setItem('not_authenticated', true);
        return Promise.resolve();
    }
    if (type === AUTH_ERROR) {
        const { status } = params;
        return status === 401 || status === 403
            ? Promise.reject()
            : Promise.resolve();
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('not_authenticated')
            ? Promise.reject()
            : Promise.resolve();
    }
    return Promise.reject('Unknown method');
};
