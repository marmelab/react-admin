import { stringify } from 'query-string';
import {
    fetchUtils,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'ra-core';

interface Pagenation {
    page: number;
    perPage: number;
}

interface Sort {
    field: string;
    order: 'ASC' | 'DESC';
}

interface GetListRequestParams {
    pagination: Pagenation;
    sort: Sort;
    filter: {
        [key: string]: any;
    };
}

interface IdParams {
    id: number | string;
}
interface IdsParams {
    ids: (number | string)[];
}

interface GetOneRequestParams extends IdParams {}

interface GetManyRequestParams extends IdsParams {}

interface GetManyReferenceRequestParams extends IdParams {
    pagination: Pagenation;
    sort: Sort;
    filter: {
        [key: string]: any;
    };
    target: string;
}
interface UpdateRequestParams extends IdParams {
    data: any;
}
interface UpdateManyRequestParams extends IdsParams {
    data: any;
}
interface CreateRequestParams {
    data: any;
}
interface DeleteRequestParams extends IdParams {}
interface DeleteManyRequestParams extends IdsParams {}
type RequestParams =
    | GetOneRequestParams
    | GetManyRequestParams
    | GetManyReferenceRequestParams
    | UpdateRequestParams
    | UpdateManyRequestParams
    | DeleteRequestParams
    | DeleteManyRequestParams;

interface RequestOptions {
    method?: string;
    body?: string;
}

interface Response {
    headers: Headers;
    json: any;
}
export type HTTPClient = (
    url: string,
    options: RequestOptions
) => Promise<Response>;

/**
 * Maps react-admin queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (
    apiUrl: string,
    httpClient: HTTPClient = fetchUtils.fetchJson
) => {
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertDataRequestToHTTP = (
        type: string,
        resource: string,
        params: RequestParams
    ) => {
        let url = '';
        const options: RequestOptions = {};
        switch (type) {
            case GET_LIST: {
                const params_ = params as GetListRequestParams;
                const { page, perPage } = params_.pagination;
                const { field, order } = params_.sort;
                const query = {
                    sort: JSON.stringify([field, order]),
                    range: JSON.stringify([
                        (page - 1) * perPage,
                        page * perPage - 1,
                    ]),
                    filter: JSON.stringify(params_.filter),
                };
                url = `${apiUrl}/${resource}?${stringify(query)}`;
                break;
            }
            case GET_ONE: {
                const params_ = params as GetOneRequestParams;

                url = `${apiUrl}/${resource}/${params_.id}`;
                break;
            }

            case GET_MANY: {
                const params_ = params as GetManyRequestParams;

                const query = {
                    filter: JSON.stringify({ id: params_.ids }),
                };
                url = `${apiUrl}/${resource}?${stringify(query)}`;
                break;
            }
            case GET_MANY_REFERENCE: {
                const params_ = params as GetManyReferenceRequestParams;

                const { page, perPage } = params_.pagination;
                const { field, order } = params_.sort;
                const query = {
                    sort: JSON.stringify([field, order]),
                    range: JSON.stringify([
                        (page - 1) * perPage,
                        page * perPage - 1,
                    ]),
                    filter: JSON.stringify({
                        ...params_.filter,
                        [params_.target]: params_.id,
                    }),
                };
                url = `${apiUrl}/${resource}?${stringify(query)}`;
                break;
            }
            case UPDATE: {
                const params_ = params as UpdateRequestParams;

                url = `${apiUrl}/${resource}/${params_.id}`;
                options.method = 'PUT';
                options.body = JSON.stringify(params_.data);
                break;
            }

            case CREATE: {
                const params_ = params as CreateRequestParams;

                url = `${apiUrl}/${resource}`;
                options.method = 'POST';
                options.body = JSON.stringify(params_.data);
                break;
            }

            case DELETE: {
                const params_ = params as DeleteRequestParams;

                url = `${apiUrl}/${resource}/${params_.id}`;
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
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} Data response
     */
    const convertHTTPResponse = (
        response: Response,
        type: string,
        resource: string,
        params
    ) => {
        const { headers, json } = response;
        switch (type) {
            case GET_LIST:
            case GET_MANY_REFERENCE:
                if (!headers.has('content-range')) {
                    throw new Error(
                        'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                    );
                }
                return {
                    data: json,
                    total: parseInt(
                        headers
                            .get('content-range')
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
     * @returns {Promise} the Promise for a data response
     */
    return (type: string, resource: string, params: RequestParams) => {
        // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
        if (type === UPDATE_MANY) {
            const params_ = params as UpdateManyRequestParams;
            return Promise.all(
                params_.ids.map(id =>
                    httpClient(`${apiUrl}/${resource}/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(params_.data),
                    })
                )
            ).then(responses => ({
                data: responses.map(response => response.json),
            }));
        }
        // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
        if (type === DELETE_MANY) {
            const params_ = params as DeleteManyRequestParams;
            return Promise.all(
                params_.ids.map(id =>
                    httpClient(`${apiUrl}/${resource}/${id}`, {
                        method: 'DELETE',
                    })
                )
            ).then(responses => ({
                data: responses.map(response => response.json),
            }));
        }

        const { url, options } = convertDataRequestToHTTP(
            type,
            resource,
            params
        );
        return httpClient(url, options).then(response =>
            convertHTTPResponse(response, type, resource, params)
        );
    };
};
