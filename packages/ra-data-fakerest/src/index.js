import FakeRest from 'fakerest';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'react-admin';

/* eslint-disable no-console */
function log(type, resource, params, response) {
    if (console.group) {
        // Better logging in Chrome
        console.groupCollapsed(type, resource, JSON.stringify(params));
        console.log(response);
        console.groupEnd();
    } else {
        console.log('FakeRest request ', type, resource, params);
        console.log('FakeRest response', response);
    }
}

/**
 * Respond to react-admin data queries using a local JavaScript object
 *
 * Useful for debugging and testing - do not use in production.
 *
 * @example
 * import fakeDataProvider from 'ra-data-fakerest';
 * const dataProvider = fakeDataProvider({
 *   posts: [
 *     { id: 0, title: 'Hello, world!' },
 *     { id: 1, title: 'FooBar' },
 *   ],
 *   comments: [
 *     { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
 *     { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
 *   ],
 * })
 */
export default (data, loggingEnabled = false) => {
    const restServer = new FakeRest.Server();
    restServer.init(data);
    if (window) {
        window.restServer = restServer; // give way to update data in the console
    }

    function getResponse(type, resource, params) {
        switch (type) {
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order],
                    range: [(page - 1) * perPage, page * perPage - 1],
                    filter: params.filter,
                };
                return {
                    data: restServer.getAll(resource, query),
                    total: restServer.getCount(resource, {
                        filter: params.filter,
                    }),
                };
            }
            case GET_ONE:
                return {
                    data: restServer.getOne(resource, params.id, { ...params }),
                };
            case GET_MANY:
                return {
                    data: restServer.getAll(resource, {
                        filter: { id: params.ids },
                    }),
                };
            case GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order],
                    range: [(page - 1) * perPage, page * perPage - 1],
                    filter: { ...params.filter, [params.target]: params.id },
                };
                return {
                    data: restServer.getAll(resource, query),
                    total: restServer.getCount(resource, {
                        filter: query.filter,
                    }),
                };
            }
            case UPDATE:
                return {
                    data: restServer.updateOne(resource, params.id, {
                        ...params.data,
                    }),
                };
            case UPDATE_MANY:
                params.ids.forEach(id =>
                    restServer.updateOne(resource, id, {
                        ...params.data,
                    })
                );
                return { data: params.ids };
            case CREATE:
                return {
                    data: restServer.addOne(resource, { ...params.data }),
                };
            case DELETE:
                return { data: restServer.removeOne(resource, params.id) };
            case DELETE_MANY:
                params.ids.forEach(id => restServer.removeOne(resource, id));
                return { data: params.ids };
            default:
                return false;
        }
    }

    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Promise} The response
     */
    return (type, resource, params) => {
        const collection = restServer.getCollection(resource);
        if (!collection) {
            return new Promise((_, reject) => reject(new Error(`Undefined collection "${resource}"`)));
        }
        let response;
        try {
            response = getResponse(type, resource, params);
        } catch (error) {
            return new Promise((_, reject) => reject(error));
        }
        if (response === false) {
            return new Promise((_, reject) => reject(new Error(`Unsupported fetch action type ${type}`)));
        }
        if (loggingEnabled) {
            log(type, resource, params, response);
        }
        return new Promise(resolve => resolve(response));
    };
};
