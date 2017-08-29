'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _fetch = require('../util/fetch');

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Maps admin-on-rest queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
exports.default = function (apiUrl) {
    var httpClient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _fetch.fetchJson;

    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    var convertRESTRequestToHTTP = function convertRESTRequestToHTTP(type, resource, params) {
        var url = '';
        var options = {};
        switch (type) {
            case _types.GET_LIST:
                {
                    var _params$pagination = params.pagination,
                        page = _params$pagination.page,
                        perPage = _params$pagination.perPage;
                    var _params$sort = params.sort,
                        field = _params$sort.field,
                        order = _params$sort.order;

                    var query = {
                        sort: JSON.stringify([field, order]),
                        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                        filter: JSON.stringify(params.filter)
                    };
                    url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(query);
                    break;
                }
            case _types.GET_ONE:
                url = apiUrl + '/' + resource + '/' + params.id;
                break;
            case _types.GET_MANY:
                {
                    var _query = {
                        filter: JSON.stringify({ id: params.ids })
                    };
                    url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(_query);
                    break;
                }
            case _types.GET_MANY_REFERENCE:
                {
                    var _params$pagination2 = params.pagination,
                        _page = _params$pagination2.page,
                        _perPage = _params$pagination2.perPage;
                    var _params$sort2 = params.sort,
                        _field = _params$sort2.field,
                        _order = _params$sort2.order;

                    var _query2 = {
                        sort: JSON.stringify([_field, _order]),
                        range: JSON.stringify([(_page - 1) * _perPage, _page * _perPage - 1]),
                        filter: JSON.stringify((0, _extends4.default)({}, params.filter, (0, _defineProperty3.default)({}, params.target, params.id)))
                    };
                    url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(_query2);
                    break;
                }
            case _types.UPDATE:
                url = apiUrl + '/' + resource + '/' + params.id;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case _types.CREATE:
                url = apiUrl + '/' + resource;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case _types.DELETE:
                url = apiUrl + '/' + resource + '/' + params.id;
                options.method = 'DELETE';
                break;
            default:
                throw new Error('Unsupported fetch action type ' + type);
        }
        return { url: url, options: options };
    };

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     */
    var convertHTTPResponseToREST = function convertHTTPResponseToREST(response, type, resource, params) {
        var headers = response.headers,
            json = response.json;

        switch (type) {
            case _types.GET_LIST:
            case _types.GET_MANY_REFERENCE:
                if (!headers.has('content-range')) {
                    throw new Error('The Content-Range header is missing in the HTTP Response. The simple REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?');
                }
                return {
                    data: json,
                    total: parseInt(headers.get('content-range').split('/').pop(), 10)
                };
            case _types.CREATE:
                return { data: (0, _extends4.default)({}, params.data, { id: json.id }) };
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
    return function (type, resource, params) {
        var _convertRESTRequestTo = convertRESTRequestToHTTP(type, resource, params),
            url = _convertRESTRequestTo.url,
            options = _convertRESTRequestTo.options;

        return httpClient(url, options).then(function (response) {
            return convertHTTPResponseToREST(response, type, resource, params);
        });
    };
};

module.exports = exports['default'];