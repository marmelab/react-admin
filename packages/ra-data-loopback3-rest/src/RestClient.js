import { stringify } from 'query-string';
import {
    fetchUtils,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'react-admin';
import { Storage } from './utils';

/**
 * Maps admin-on-rest queries to a loopback powered REST API
 *
 * @see https://github.com/strongloop/loopback
 * @example
 * GET_LIST     => GET http://my.api.url/posts?filter[sort]="title ASC"&filter[skip]=0&filter[limit]=20
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter[where][or]=[{id:123},{id:456}]
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 *
 * SETFIL Changes:
 *
 * - Copy from jsonServer.js
 * - Add loopback supported client
 * - Ignore null property in filters
 */
export const RestClient = (apiUrl, httpClient = fetchUtils.fetchJson) => {
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertRESTRequestToHTTP = (type, resource, params) => {
        resource = resource.toLowerCase();
        let url = '';
        const options = {};
        switch (type) {
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {};
                query.where = { ...params.filter };
                if (field) query.order = [`${field} ${order}`];
                if (perPage > 0) {
                    query.limit = perPage;
                    if (page >= 0) {
                        query.skip = (page - 1) * perPage;
                    }
                }
                url = `${apiUrl}/${resource}?${stringify({
                    filter: JSON.stringify(
                        query,
                        (k, v) => (v !== null ? v : undefined)
                    ),
                })}`;
                break;
            }
            case GET_ONE:
                url = `${apiUrl}/${resource}/${params.id}`;
                break;
            case GET_MANY: {
                const listId = params.ids.map(id => ({ id }));
                const query = {
                    where: { or: listId },
                };
                url = `${apiUrl}/${resource}?${stringify({
                    filter: JSON.stringify(
                        query,
                        (k, v) => (v !== null ? v : undefined)
                    ),
                })}`;
                break;
            }
            case GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {};
                query.where = { ...params.filter };
                query.where[params.target] = params.id;
                if (field) query.order = [`${field} ${order}`];
                if (perPage > 0) {
                    query.limit = perPage;
                    if (page >= 0) {
                        query.skip = (page - 1) * perPage;
                    }
                }
                url = `${apiUrl}/${resource}?${stringify({
                    filter: JSON.stringify(
                        query,
                        (k, v) => (v !== null ? v : undefined)
                    ),
                })}`;
                break;
            }
            case UPDATE:
                url = `${apiUrl}/${resource}/${params.id}`;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case CREATE:
                url = `${apiUrl}/${resource}`;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case DELETE:
                url = `${apiUrl}/${resource}/${params.id}`;
                options.method = 'DELETE';
                break;
            default:
                throw new Error(`Unsupported fetch action type ${type}`);
        }
        //
        let token = Storage.getToken();
        token = token || '';
        if (url.indexOf('?') >= 0) {
            url = url + '&access_token=' + token;
        } else {
            url = url + '?access_token=' + token;
        }
        return { url, options };
    };

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     */
    const convertHTTPResponseToREST = (response, type, resource, params) => {
        const { headers, json } = response;
        switch (type) {
            case GET_LIST:
            case GET_MANY_REFERENCE:
                if (!headers.has('x-total-count')) {
                    throw new Error(
                        'The X-Total-Count header is missing in the HTTP Response. The jsonServer REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
                    );
                }
                return {
                    data: json,
                    total: parseInt(
                        headers
                            .get('x-total-count')
                            .split('/')
                            .pop(),
                        10
                    ),
                };
            case CREATE:
                return { data: { ...params.data, id: json.id } };
            default:
                return { data: json };
        }
    };

    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
    return (type, resource, params) => {
        const { url, options } = convertRESTRequestToHTTP(
            type,
            resource,
            params
        );
        return httpClient(url, options).then(response =>
            convertHTTPResponseToREST(response, type, resource, params)
        );
    };
};
