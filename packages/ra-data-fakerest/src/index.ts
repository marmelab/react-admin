import FakeRest from 'fakerest';
import { DataProvider } from 'ra-core';

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
 *
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
export default (data, loggingEnabled = false): DataProvider => {
    const restServer = new FakeRest.Server();
    restServer.init(data);
    if (window) {
        // give way to update data in the console
        (window as any).restServer = restServer;
    }

    function getResponse(type, resource, params) {
        switch (type) {
            case 'getList': {
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
            case 'getOne':
                return {
                    data: restServer.getOne(resource, params.id, { ...params }),
                };
            case 'getMany':
                return {
                    data: restServer.getAll(resource, {
                        filter: { id: params.ids },
                    }),
                };
            case 'getManyReference': {
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
            case 'update':
                return {
                    data: restServer.updateOne(resource, params.id, {
                        ...params.data,
                    }),
                };
            case 'updateMany':
                params.ids.forEach(id =>
                    restServer.updateOne(resource, id, {
                        ...params.data,
                    })
                );
                return { data: params.ids };
            case 'create':
                return {
                    data: restServer.addOne(resource, { ...params.data }),
                };
            case 'delete':
                return { data: restServer.removeOne(resource, params.id) };
            case 'deleteMany':
                params.ids.forEach(id => restServer.removeOne(resource, id));
                return { data: params.ids };
            default:
                return false;
        }
    }

    /**
     * @param {String} type One of the data Provider methods, e.g. 'getList'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Promise} The response
     */
    const handle = (type, resource, params): Promise<any> => {
        const collection = restServer.getCollection(resource);
        if (!collection) {
            return Promise.reject(
                new Error(`Undefined collection "${resource}"`)
            );
        }
        let response;
        try {
            response = getResponse(type, resource, params);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
        if (loggingEnabled) {
            log(type, resource, params, response);
        }
        return Promise.resolve(response);
    };

    return {
        getList: (resource, params) => handle('getList', resource, params),
        getOne: (resource, params) => handle('getOne', resource, params),
        getMany: (resource, params) => handle('getMany', resource, params),
        getManyReference: (resource, params) =>
            handle('getManyReference', resource, params),
        update: (resource, params) => handle('update', resource, params),
        updateMany: (resource, params) =>
            handle('updateMany', resource, params),
        create: (resource, params) => handle('create', resource, params),
        delete: (resource, params) => handle('delete', resource, params),
        deleteMany: (resource, params) =>
            handle('deleteMany', resource, params),
    };
};
