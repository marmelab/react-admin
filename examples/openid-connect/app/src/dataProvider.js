import getProfileFromToken from "./getProfileFromToken";

const dataProvider = (type, resource, params) => {
    if (resource === 'profile' && type === 'GET_ONE') {
        const token = window.localStorage.getItem('token');

        if (!token) {
            return Promise.resolve({ data: null })
        }

        const profile = getProfileFromToken(token);

        return Promise.resolve({ data: profile })
    }

    switch (type) {
        case 'GET_LIST':
            return { data: [{ id: 'id', name: 'Resource', date: new Date() }], total: 1 };
        default:
            return null;
    }
}

export default dataProvider;
