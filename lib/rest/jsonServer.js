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
 * Maps admin-on-rest queries to a json-server powered REST API
 *
 * @see https://github.com/typicode/json-server
 * @example
 * GET_LIST     => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789
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

                    var query = (0, _extends4.default)({}, params.filter, {
                        _sort: field,
                        _order: order,
                        _start: (page - 1) * perPage,
                        _end: page * perPage
                    });
                    url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(query);
                    break;
                }
            case _types.GET_ONE:
                url = apiUrl + '/' + resource + '/' + params.id;
                break;
            case _types.GET_MANY_REFERENCE:
                {
                    var _extends2;

                    var _params$pagination2 = params.pagination,
                        _page = _params$pagination2.page,
                        _perPage = _params$pagination2.perPage;
                    var _params$sort2 = params.sort,
                        _field = _params$sort2.field,
                        _order = _params$sort2.order;

                    var _query = (0, _extends4.default)({}, params.filter, (_extends2 = {}, (0, _defineProperty3.default)(_extends2, params.target, params.id), (0, _defineProperty3.default)(_extends2, '_sort', _field), (0, _defineProperty3.default)(_extends2, '_order', _order), (0, _defineProperty3.default)(_extends2, '_start', (_page - 1) * _perPage), (0, _defineProperty3.default)(_extends2, '_end', _page * _perPage), _extends2));
                    url = apiUrl + '/' + resource + '?' + (0, _fetch.queryParameters)(_query);
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
                if (!headers.has('x-total-count')) {
                    throw new Error('The X-Total-Count header is missing in the HTTP Response. The jsonServer REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?');
                }
                return {
                    data: json,
                    total: parseInt(headers.get('x-total-count').split('/').pop(), 10)
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
        // json-server doesn't handle WHERE IN requests, so we fallback to calling GET_ONE n times instead
        if (type === _types.GET_MANY) {
            return Promise.all(params.ids.map(function (id) {
                return httpClient(apiUrl + '/' + resource + '/' + id);
            })).then(function (responses) {
                return { data: responses.map(function (response) {
                        return response.json;
                    }) };
            });
        }

        var _convertRESTRequestTo = convertRESTRequestToHTTP(type, resource, params),
            url = _convertRESTRequestTo.url,
            options = _convertRESTRequestTo.options;

        return httpClient(url, options).then(function (response) {
            return convertHTTPResponseToREST(response, type, resource, params);
        });
    };
};

module.exports = exports['default'];