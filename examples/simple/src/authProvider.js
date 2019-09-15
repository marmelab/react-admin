// Authenticatd by default
export default {
    login: ({ username, password }) => {
        if (username === 'login' && password === 'password') {
            localStorage.removeItem('not_authenticated');
            localStorage.removeItem('role');
            return Promise.resolve();
        }
        if (username === 'user' && password === 'password') {
            localStorage.setItem('role', 'user');
            localStorage.removeItem('not_authenticated');
            return Promise.resolve();
        }
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('role', 'admin');
            localStorage.removeItem('not_authenticated');
            return Promise.resolve();
        }
        localStorage.setItem('not_authenticated', true);
        return Promise.reject();
    },
    logout: () => {
        localStorage.setItem('not_authenticated', true);
        localStorage.removeItem('role');
        return Promise.resolve();
    },
    checkError: ({ status }) => {
        return status === 401 || status === 403
            ? Promise.reject()
            : Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('not_authenticated')
            ? Promise.reject()
            : Promise.resolve();
    },
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return Promise.resolve(role);
    },
};
