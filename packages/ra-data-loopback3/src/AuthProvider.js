import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';
import { Storage } from './utils';

export const AuthProvider = (loginUrl = '/api/users/login') => {
    return (type, params) => {
        if (type === AUTH_LOGIN) {
            const { username, password } = params;
            const request = new Request(`${loginUrl}`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            })
            return fetch(request)
                .then(response => {
                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then((data) => {
                    Storage.saveUser(data);
                    return Promise.resolve();
                });
        } else if (type === AUTH_LOGOUT) {
            Storage.removeUser();
            return Promise.resolve();
        } else if (type === AUTH_ERROR) {
            return Promise.resolve();

        } else if (type === AUTH_CHECK) {
            if (Storage.getUser()) {
                return Promise.resolve()
            }
            return Promise.reject();
        } else if (type === AUTH_GET_PERMISSIONS) {
            const roles = Storage.getRoles();
            return Promise.resolve(roles);
        }
        return Promise.reject('Unkown method');
    };
};

