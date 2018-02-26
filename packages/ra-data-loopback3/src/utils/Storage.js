/**
 * SETFIL Changes:
 *
 * - Add LocalStorage support
 */
const LB_TOKEN = 'lbToken';
export const Storage = {
    saveUser: data => {
        if (typeof Storage === 'undefined') {
            return false;
        }
        data.expire = new Date().getTime() + data.ttl * 1000;
        localStorage.setItem(LB_TOKEN, JSON.stringify(data));
        return true;
    },
    getUser: () => {
        try {
            if (typeof Storage === 'undefined') {
                return false;
            }
            let data = localStorage.getItem(LB_TOKEN);
            if (data) {
                data = JSON.parse(data);
                if (new Date().getTime() < data.expire) {
                    return data;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },
    removeUser: () => {
        if (typeof Storage === 'undefined') {
            return false;
        }
        localStorage.removeItem(LB_TOKEN);
    },
    getToken: () => {
        return Storage.getUser().id;
    },
    getRoles: () => {
        return Storage.getUser().roles;
    },
};
