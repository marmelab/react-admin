import { queryParameters, fetchJson } from 'ra-core/lib/util/fetch';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    DELETE_MANY,
} from 'react-admin';

/**
 * Maps admin-on-rest queries to a postgrest API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_MANY_REFERENCE
 *              => GET http://my.api.url/posts/2
 * GET_LIST     => GET http://my.api.url/posts?order=title.asc
 * GET_ONE      => GET http://my.api.url/posts?id=eq.123
 * GET_MANY     => GET http://my.api.url/posts?id=in.(123,456,789)
 * UPDATE       => PATCH http://my.api.url/posts?id=eq.123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts?id=eq.123
 */
export default (apiUrl, httpClient = fetchJson) => {
    const convertFilters = (filters) => {
        let rest = {};

        Object.keys(filters).map(function (key) {
            switch (typeof filters[key]) {
                case 'string':
                    rest[key]='ilike.*' + filters[key].replace(/:/,'') + '*';
                    break;

                case 'boolean':
                    rest[key]='is.' + filters[key];
                    break;

                case 'undefined':
                    rest[key]='is.null';
                    break;

                case 'number':
                    rest[key]='eq.' + filters[key];
                    break;

                case 'object':
                    if (filters[key].constructor === Array) {
                      rest[key]='cs.{' + filters[key].toString().replace(/:/,'') + '}';
                    } else {
                      Object.keys(filters[key]).map( (val) => (
                        rest[`${key}->>${val}`]=`ilike.*${filters[key][val]}*`
                      ));
                    }
                    break;

                default:
                    rest[key]='ilike.*' + filters[key].toString().replace(/:/,'') + '*';
                    break;
            }
        });
        return rest;
    }

    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertRESTRequestToHTTP = (type, resource, params) => {
        let url = '';
        const options = {};
		options.headers = new Headers();
        switch (type) {
        case GET_LIST: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
			options.headers.set('Range-Unit','items');
			options.headers.set('Range',((page-1)*perPage) + '-' + ((page * perPage) -1)   );
			options.headers.set('Prefer','count=exact');
			const pf = params.filter;
            let query = {
                order: field + '.' +  order.toLowerCase(),
            };
			Object.assign(query, convertFilters(params.filter));
            url = `${apiUrl}/${resource}?${queryParameters(query)}`;
            break;
        }
        case GET_ONE: {
			options.headers.set('Accept','application/vnd.pgrst.object+json');
            url = `${apiUrl}/${resource}?id=eq.${params.id}`;
            break;
        }
        case GET_MANY: {
            url = `${apiUrl}/${resource}?id=in.(${params.ids.join(',')})`;
            break;
        }
        case GET_MANY_REFERENCE: {
            const filters = {};
            const { field, order } = params.sort;
			filters[params.target] = params.id;
            let query = {
                order: field + '.' +  order.toLowerCase(),
            };
			Object.assign(query, convertFilters(filters));
            url = `${apiUrl}/${resource}?${queryParameters(query)}`;
            break;
        }
        case UPDATE: {
            url = `${apiUrl}/${resource}?id=eq.${params.id}`;
            options.method = 'PATCH';
            options.body = JSON.stringify(params.data);
            break;
        }
        case CREATE: {
            url = `${apiUrl}/${resource}`;
			options.headers.set('Accept','application/vnd.pgrst.object+json');
			options.headers.set('Prefer','return=representation');
            options.method = 'POST';
            options.body = JSON.stringify(params.data);
            break;
        }
        case DELETE: {
            url = `${apiUrl}/${resource}?id=eq.${params.id}`;
            options.method = 'DELETE';
            break;
        }
        case DELETE_MANY: {
            url = `${apiUrl}/${resource}?id=in.(${params.ids.join(',')})`;
            options.method = 'DELETE';
            break;
        }
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
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
            if (!headers.has('content-range')) {
                throw new Error('The Content-Range header is missing in the HTTP Response. The simple REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?');
            }
			const maxInPage = parseInt(headers.get('content-range').split('/')[0].split('-').pop(), 10) +1
            return {
                data: json.map(x => x),
                total: parseInt(headers.get('content-range').split('/').pop(), 10) || maxInPage,
            };
        case CREATE:
            return { data:params.data, id: json.id };
        case UPDATE:
            return { data:params.data, id: params.id };
        case DELETE:
            return { data:[],id: params.id };
        case DELETE_MANY:
            return { data:[],id: params.id };
        case GET_ONE:
            return { data:json,id: params.id };
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
        const { url, options } = convertRESTRequestToHTTP(type, resource, params);
        return httpClient(url, options)
            .then(response => convertHTTPResponseToREST(response, type, resource, params));
    };
};