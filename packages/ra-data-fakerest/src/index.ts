import { Database } from 'fakerest';
import { DataProvider } from 'ra-core';

/* eslint-disable no-console */
function log(type, resource, params, response) {
    // @ts-ignore
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

function delayed(response: any, delay?: number) {
    // If there is no delay, we return the value right away/
    // This saves a tick in unit tests.
    return delay
        ? new Promise(resolve => {
              setTimeout(() => resolve(response), delay);
          })
        : response;
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
export default (data, loggingEnabled = false, delay?: number): DataProvider => {
    const database = new Database({ data });
    if (typeof window !== 'undefined') {
        // give way to update data in the console
        (window as any)._database = database;
    }

    function getResponse(type, resource, params) {
        switch (type) {
            case 'getList': {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order] as [string, 'asc' | 'desc'],
                    range: [(page - 1) * perPage, page * perPage - 1] as [
                        number,
                        number,
                    ],
                    filter: params.filter,
                    embed: getEmbedParam(
                        params.meta?.embed,
                        params.meta?.prefetch
                    ),
                };
                const data = database.getAll(resource, query);
                const prefetched = getPrefetchedData(
                    data,
                    params.meta?.prefetch
                );
                return delayed(
                    {
                        data: removePrefetchedData(data, params.meta?.prefetch),
                        total: database.getCount(resource, {
                            filter: params.filter,
                        }),
                        meta: params.meta?.prefetch
                            ? { prefetched }
                            : undefined,
                    },
                    delay
                );
            }
            case 'getOne': {
                const data = database.getOne(resource, params.id, {
                    ...params,
                    embed: getEmbedParam(
                        params.meta?.embed,
                        params.meta?.prefetch
                    ),
                });
                const prefetched = getPrefetchedData(
                    data,
                    params.meta?.prefetch
                );
                return delayed(
                    {
                        data: removePrefetchedData(data, params.meta?.prefetch),
                        meta: params.meta?.prefetch
                            ? { prefetched }
                            : undefined,
                    },
                    delay
                );
            }
            case 'getMany': {
                const data = params.ids.map(id =>
                    database.getOne(resource, id, {
                        ...params,
                        embed: getEmbedParam(
                            params.meta?.embed,
                            params.meta?.prefetch
                        ),
                    })
                );
                const prefetched = getPrefetchedData(
                    data,
                    params.meta?.prefetch
                );
                return delayed(
                    {
                        data: removePrefetchedData(data, params.meta?.prefetch),
                        meta: params.meta?.prefetch
                            ? { prefetched }
                            : undefined,
                    },
                    delay
                );
            }
            case 'getManyReference': {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order] as [string, 'asc' | 'desc'],
                    range: [(page - 1) * perPage, page * perPage - 1] as [
                        number,
                        number,
                    ],
                    filter: { ...params.filter, [params.target]: params.id },
                    embed: getEmbedParam(
                        params.meta?.embed,
                        params.meta?.prefetch
                    ),
                };
                const data = database.getAll(resource, query);
                const prefetched = getPrefetchedData(
                    data,
                    params.meta?.prefetch
                );
                return delayed(
                    {
                        data: removePrefetchedData(data, params.meta?.prefetch),
                        total: database.getCount(resource, {
                            filter: query.filter,
                        }),
                        meta: params.meta?.prefetch
                            ? { prefetched }
                            : undefined,
                    },
                    delay
                );
            }
            case 'update':
                return delayed(
                    {
                        data: database.updateOne(
                            resource,
                            params.id,
                            cleanupData(params.data)
                        ),
                    },
                    delay
                );
            case 'updateMany':
                params.ids.forEach(id =>
                    database.updateOne(resource, id, cleanupData(params.data))
                );
                return delayed({ data: params.ids }, delay);
            case 'create':
                return delayed(
                    {
                        data: database.addOne(
                            resource,
                            cleanupData(params.data)
                        ),
                    },
                    delay
                );
            case 'delete':
                return delayed(
                    { data: database.removeOne(resource, params.id) },
                    delay
                );
            case 'deleteMany':
                params.ids.forEach(id => database.removeOne(resource, id));
                return delayed({ data: params.ids }, delay);
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
    const handle = async (type, resource, params): Promise<any> => {
        const collection = database.getCollection(resource);
        if (!collection && type !== 'create') {
            const error = new UndefinedResourceError(
                `Undefined collection "${resource}"`
            );
            error.code = 1; // make that error detectable
            throw error;
        }
        let response;
        try {
            response = await getResponse(type, resource, params);
        } catch (error) {
            console.error(error);
            throw error;
        }
        if (loggingEnabled) {
            const { signal, ...paramsWithoutSignal } = params;
            log(type, resource, paramsWithoutSignal, response);
        }
        return response;
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

function getEmbedParam(embed: string[], prefetch: string[]) {
    if (!embed && !prefetch) return;
    const param = new Set<string>();
    if (embed) embed.forEach(e => param.add(e));
    if (prefetch) prefetch.forEach(e => param.add(e));
    return Array.from(param);
}

/**
 * Extract embeds from FakeRest responses
 *
 * When calling FakeRest database.getOne('comments', 123, { embed: 'post' }),
 * the FakeRest response adds a `post` key to the response, containing the
 * related post. Something like:
 *
 *     { id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }
 *
 * We want to copy all the embeds in a data object, that will later
 * be included into the response meta.prefetched key.
 *
 * @example getPrefetchedData({ id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }, ['post'])
 * // {
 * //   posts: [{ id: 1, title: 'Hello, world' }] }
 * // }
 */
const getPrefetchedData = (data, prefetchParam?: string[]) => {
    if (!prefetchParam) return undefined;
    const prefetched = {};
    const dataArray = Array.isArray(data) ? data : [data];
    prefetchParam.forEach(name => {
        const resource = name.endsWith('s') ? name : `${name}s`;
        dataArray.forEach(record => {
            if (!prefetched[resource]) {
                prefetched[resource] = [];
            }
            if (prefetched[resource].some(r => r.id === record[name].id)) {
                // do not add the record if it's already there
                return;
            }
            prefetched[resource].push(record[name]);
        });
    });

    return prefetched;
};

/**
 * Remove embeds from FakeRest responses
 *
 * When calling FakeRest database.getOne('comments', 123, { embed: 'post' }),
 * the FakeRest response adds a `post` key to the response, containing the
 * related post. Something like:
 *
 *     { id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }
 *
 * We want to remove all the embeds from the response.
 *
 * @example removePrefetchedData({ id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }, 'post')
 * // { id: 123, body: 'Nice post!' }
 */
const removePrefetchedData = (data, prefetchParam?: string[]) => {
    if (!prefetchParam) return data;
    const dataArray = Array.isArray(data) ? data : [data];
    const newDataArray = dataArray.map(record => {
        const newRecord = {};
        for (const key in record) {
            if (!prefetchParam.includes(key)) {
                newRecord[key] = record[key];
            }
        }
        return newRecord;
    });
    return Array.isArray(data) ? newDataArray : newDataArray[0];
};

/**
 * Clone the data and ignore undefined values.
 *
 * If we don't do this, an update with { id: undefined } as payload
 * would remove the id from the record, which no real data provider does.
 *
 * Also, this is a way to ensure we don't keep a reference to the data
 * and that the data is not mutated.
 */
const cleanupData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

class UndefinedResourceError extends Error {
    code: number;
}
