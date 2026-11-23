import { stringify } from '@marmelab/query-string';
import { fetchUtils, DataProvider, Identifier } from 'ra-core';

/**
 * Encode a record identifier as one segment of the request path.
 * Throws if the identifier is not a valid path segment.
 */
const encodeId = (id: Identifier) => {
    const encodedId = encodeURIComponent(id);
    if (encodedId === '' || encodedId === '.' || encodedId === '..') {
        throw new Error(
            `The json-server data provider cannot build a URL for the identifier "${id}"`
        );
    }
    return encodedId;
};

// Servers usually read the first 1000 parameters of a query string, and ignore the others
const MAX_QUERY_PARAMETERS = 1000;

/**
 * Build the query string of a list request.
 * Throws if the query has more parameters than what servers read.
 */
const getListQueryString = (query: any) => {
    const queryString = stringify(query);
    if (queryString.split('&').length > MAX_QUERY_PARAMETERS) {
        throw new Error(
            `The json-server data provider cannot send more than ${MAX_QUERY_PARAMETERS} query parameters`
        );
    }
    return queryString;
};

/**
 * Maps react-admin queries to a json-server powered REST API
 *
 * @see https://github.com/typicode/json-server
 *
 * @example
 *
 * getList          => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * getOne           => GET http://my.api.url/posts/123
 * getManyReference => GET http://my.api.url/posts?author_id=345
 * getMany          => GET http://my.api.url/posts?id=123&id=456&id=789
 * create           => POST http://my.api.url/posts/123
 * update           => PUT http://my.api.url/posts/123
 * updateMany       => PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
 * delete           => DELETE http://my.api.url/posts/123
 * deleteMany       => DELETE http://my.api.url/posts/123, DELETE http://my.api.url/posts/456, DELETE http://my.api.url/posts/789
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import jsonServerProvider from 'ra-data-json-server';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson): DataProvider => ({
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination || {};
        const { field, order } = params.sort || {};
        const query = {
            ...fetchUtils.flattenObject(params.filter),
            _sort: field,
            _order: order,
            _start:
                page != null && perPage != null
                    ? (page - 1) * perPage
                    : undefined,
            _end: page != null && perPage != null ? page * perPage : undefined,
            _embed: params?.meta?.embed,
        };
        const url = `${apiUrl}/${resource}?${getListQueryString(query)}`;

        const { headers, json } = await httpClient(url, {
            signal: params?.signal,
        });
        if (!headers.has('x-total-count')) {
            throw new Error(
                'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
            );
        }
        const totalString = headers.get('x-total-count')!.split('/').pop();
        if (totalString == null) {
            throw new Error(
                'The X-Total-Count header is invalid in the HTTP Response.'
            );
        }
        return { data: json, total: parseInt(totalString, 10) };
    },

    getOne: async (resource, params) => {
        let url = `${apiUrl}/${resource}/${encodeId(params.id)}`;
        if (params?.meta?.embed) {
            url += `?_embed=${params.meta.embed}`;
        }
        const { json } = await httpClient(url, { signal: params?.signal });
        return { data: json };
    },

    getMany: async (resource, params) => {
        const query = {
            id: params.ids,
            _embed: params?.meta?.embed,
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, { signal: params?.signal });
        return { data: json };
    },

    getManyReference: async (resource, params) => {
        // stringify() omits a key whose value is an empty array, which would drop the target filter
        if (Array.isArray(params.id) && params.id.length === 0) {
            return { data: [], total: 0 };
        }
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            ...fetchUtils.flattenObject(params.filter),
            [params.target]: params.id,
            _sort: field,
            _order: order,
            _start: (page - 1) * perPage,
            _end: page * perPage,
            _embed: params?.meta?.embed,
        };
        const url = `${apiUrl}/${resource}?${getListQueryString(query)}`;

        const { headers, json } = await httpClient(url, {
            signal: params?.signal,
        });

        if (!headers.has('x-total-count')) {
            throw new Error(
                'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
            );
        }
        const totalString = headers.get('x-total-count')!.split('/').pop();
        if (totalString == null) {
            throw new Error(
                'The X-Total-Count header is invalid in the HTTP Response.'
            );
        }
        return { data: json, total: parseInt(totalString, 10) };
    },

    update: async (resource, params) => {
        const { json } = await httpClient(
            `${apiUrl}/${resource}/${encodeId(params.id)}`,
            {
                method: 'PUT',
                body: JSON.stringify(params.data),
            }
        );
        return { data: json };
    },

    // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    updateMany: async (resource, params) => {
        const urls = params.ids.map(
            id => `${apiUrl}/${resource}/${encodeId(id)}`
        );
        const responses = await Promise.all(
            urls.map(url =>
                httpClient(url, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        );
        return { data: responses.map(({ json }) => json.id) };
    },

    create: async (resource, params) => {
        const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });
        return { data: { ...params.data, ...json } as any };
    },

    delete: async (resource, params) => {
        const { json } = await httpClient(
            `${apiUrl}/${resource}/${encodeId(params.id)}`,
            { method: 'DELETE' }
        );
        return { data: json };
    },

    // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: async (resource, params) => {
        const urls = params.ids.map(
            id => `${apiUrl}/${resource}/${encodeId(id)}`
        );
        const responses = await Promise.all(
            urls.map(url =>
                httpClient(url, {
                    method: 'DELETE',
                })
            )
        );
        return { data: responses.map(({ json }) => json.id) };
    },
});
