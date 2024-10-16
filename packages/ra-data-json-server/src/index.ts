import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';

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
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

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
        let url = `${apiUrl}/${resource}/${params.id}`;
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
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

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
            `${apiUrl}/${resource}/${params.id}`,
            {
                method: 'PUT',
                body: JSON.stringify(params.data),
            }
        );
        return { data: json };
    },

    // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    updateMany: async (resource, params) => {
        const responses = await Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
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
            `${apiUrl}/${resource}/${params.id}`,
            { method: 'DELETE' }
        );
        return { data: json };
    },

    // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: async (resource, params) => {
        const responses = await Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                })
            )
        );
        return { data: responses.map(({ json }) => json.id) };
    },
});
