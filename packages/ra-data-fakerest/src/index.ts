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
                    embed: params.meta?.embed,
                };
                const data = database.getAll(resource, query);
                const { data: dataWithoutEmbeds, embeds } = getEmbedsForList(
                    data,
                    params.meta?.embed
                );
                return delayed(
                    {
                        data: dataWithoutEmbeds,
                        total: database.getCount(resource, {
                            filter: params.filter,
                        }),
                        meta: params.meta?.embed
                            ? { _embed: embeds }
                            : undefined,
                    },
                    delay
                );
            }
            case 'getOne': {
                const data = database.getOne(resource, params.id, {
                    ...params,
                    embed: params.meta?.embed,
                });
                const { data: dataWithoutEmbeds, embeds } = getEmbeds(
                    data,
                    params.meta?.embed
                );
                return delayed(
                    {
                        data: dataWithoutEmbeds,
                        meta: params.meta?.embed
                            ? { _embed: embeds }
                            : undefined,
                    },
                    delay
                );
            }
            case 'getMany': {
                const data = params.ids.map(id =>
                    database.getOne(resource, id, { ...params })
                );
                const { data: dataWithoutEmbeds, embeds } = getEmbedsForList(
                    data,
                    params.meta?.embed
                );
                return delayed(
                    {
                        data: dataWithoutEmbeds,
                        meta: params.meta?.embed
                            ? { _embed: embeds }
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
                    embed: params.meta?.embed,
                };
                const data = database.getAll(resource, query);
                const { data: dataWithoutEmbeds, embeds } = getEmbedsForList(
                    data,
                    params.meta?.embed
                );
                return delayed(
                    {
                        data: dataWithoutEmbeds,
                        total: database.getCount(resource, {
                            filter: query.filter,
                        }),
                        meta: params.meta?.embed
                            ? { _embed: embeds }
                            : undefined,
                    },
                    delay
                );
            }
            case 'update':
                return delayed(
                    {
                        data: database.updateOne(resource, params.id, {
                            ...params.data,
                        }),
                    },
                    delay
                );
            case 'updateMany':
                params.ids.forEach(id =>
                    database.updateOne(resource, id, {
                        ...params.data,
                    })
                );
                return delayed({ data: params.ids }, delay);
            case 'create':
                return delayed(
                    { data: database.addOne(resource, { ...params.data }) },
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

/**
 * Extract embeds from FakeRest responses
 *
 * When calling FakeRest database.getOne('comments', 123, { embed: 'post' }),
 * the FakeRest response adds a `post` key to the response, containing the
 * related post. Something like:
 *
 *     { id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }
 *
 * We want to extract this post and put it in a data object, that will later
 * be included into the response _embed meta key.
 *
 * @example getEmbeds({ id: 123, body: 'Nice post!', post: { id: 1, title: 'Hello, world' } }, 'post')
 * // {
 * //   data: { id: 123, body: 'Nice post!' },
 * //   embeds: { posts: [{ id: 1, title: 'Hello, world' }] }
 * // }
 */
const getEmbeds = (data, embedParam) => {
    if (!embedParam) return { data, embeds: undefined };
    const embeds = {};
    const embedsParam = Array.isArray(embedParam) ? embedParam : [embedParam];
    embedsParam.forEach(embed => {
        if (Array.isArray(data[embed])) {
            embeds[embed] = data[embed];
        } else {
            embeds[`${embed}s`] = [data[embed]];
        }
    });

    // remove the embeds from the data
    const dataCopy = {};
    Object.keys(data).forEach(key => {
        if (!embedsParam.includes(key)) {
            dataCopy[key] = data[key];
        }
    });

    return { data: dataCopy, embeds };
};

const getEmbedsForList = (data, embedParam) => {
    if (!embedParam) return { data, embeds: undefined };
    const embeds = {};
    const embedsParam = Array.isArray(embedParam) ? embedParam : [embedParam];
    embedsParam.forEach(embed => {
        if (Array.isArray(data[0][embed])) {
            embeds[embed] = [];
            // add the embeds unless they are already there
            data.forEach(record => {
                if (
                    !embeds[embed].find(
                        embeddedRecord => embeddedRecord.id === record[embed].id
                    )
                ) {
                    embeds[embed].push(record[embed]);
                }
            });
        } else {
            embeds[`${embed}s`] = [];
            // add the embeds unless they are already there
            data.forEach(record => {
                if (
                    !embeds[`${embed}s`].find(
                        embeddedRecord => embeddedRecord.id === record[embed].id
                    )
                ) {
                    embeds[`${embed}s`].push(record[embed]);
                }
            });
        }
    });

    // remove the embeds from the data
    const dataCopy = data.map(record => {
        const recordCopy = {};
        Object.keys(record).forEach(key => {
            if (!embedsParam.includes(key)) {
                recordCopy[key] = record[key];
            }
        });
        return recordCopy;
    });

    return { data: dataCopy, embeds };
};

class UndefinedResourceError extends Error {
    code: number;
}
