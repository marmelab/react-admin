(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["FakeRest"] = factory();
	else
		root["FakeRest"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(5)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _Server = __webpack_require__(1);

	var _Server2 = _interopRequireDefault(_Server);

	var _FetchServer = __webpack_require__(2);

	var _FetchServer2 = _interopRequireDefault(_FetchServer);

	var _Collection = __webpack_require__(3);

	var _Collection2 = _interopRequireDefault(_Collection);

	var _Single = __webpack_require__(4);

	var _Single2 = _interopRequireDefault(_Single);

	exports['default'] = {
	    Server: _Server2['default'],
	    FetchServer: _FetchServer2['default'],
	    Collection: _Collection2['default'],
	    Single: _Single2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(6)['default'];

	var _classCallCheck = __webpack_require__(7)['default'];

	var _Object$keys = __webpack_require__(8)['default'];

	var _getIterator = __webpack_require__(9)['default'];

	var _interopRequireDefault = __webpack_require__(5)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _objectAssign = __webpack_require__(13);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _Collection = __webpack_require__(3);

	var _Collection2 = _interopRequireDefault(_Collection);

	var _Single = __webpack_require__(4);

	var _Single2 = _interopRequireDefault(_Single);

	var _parseQueryString = __webpack_require__(10);

	var _parseQueryString2 = _interopRequireDefault(_parseQueryString);

	var assign = _objectAssign2['default'].getPolyfill();

	var Server = (function () {
	    function Server() {
	        var baseUrl = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	        _classCallCheck(this, Server);

	        this.baseUrl = baseUrl;
	        this.loggingEnabled = false;
	        this.defaultQuery = function () {};
	        this.batchUrl = null;
	        this.collections = {};
	        this.singles = {};
	        this.requestInterceptors = [];
	        this.responseInterceptors = [];
	    }

	    _createClass(Server, [{
	        key: 'init',

	        /**
	         * Shortcut for adding several collections if identifierName is always 'id'
	         */
	        value: function init(data) {
	            for (var _name in data) {
	                if (Array.isArray(data[_name])) {
	                    this.addCollection(_name, new _Collection2['default'](data[_name], 'id'));
	                } else {
	                    this.addSingle(_name, new _Single2['default'](data[_name]));
	                }
	            }
	        }
	    }, {
	        key: 'toggleLogging',
	        value: function toggleLogging() {
	            this.loggingEnabled = !this.loggingEnabled;
	        }
	    }, {
	        key: 'setDefaultQuery',

	        /**
	         * @param Function ResourceName => object
	         */
	        value: function setDefaultQuery(query) {
	            this.defaultQuery = query;
	        }
	    }, {
	        key: 'setBatchUrl',
	        value: function setBatchUrl(batchUrl) {
	            this.batchUrl = batchUrl;
	        }
	    }, {
	        key: 'setBatch',

	        /**
	         * @deprecated use setBatchUrl instead
	         */
	        value: function setBatch(url) {
	            console.warn('Server.setBatch() is deprecated, use Server.setBatchUrl() instead');
	            this.batchUrl = url;
	        }
	    }, {
	        key: 'addCollection',
	        value: function addCollection(name, collection) {
	            this.collections[name] = collection;
	            collection.setServer(this);
	            collection.setName(name);
	        }
	    }, {
	        key: 'getCollection',
	        value: function getCollection(name) {
	            return this.collections[name];
	        }
	    }, {
	        key: 'getCollectionNames',
	        value: function getCollectionNames() {
	            return _Object$keys(this.collections);
	        }
	    }, {
	        key: 'addSingle',
	        value: function addSingle(name, single) {
	            this.singles[name] = single;
	            single.setServer(this);
	            single.setName(name);
	        }
	    }, {
	        key: 'getSingle',
	        value: function getSingle(name) {
	            return this.singles[name];
	        }
	    }, {
	        key: 'getSingleNames',
	        value: function getSingleNames() {
	            return _Object$keys(this.singles);
	        }
	    }, {
	        key: 'addRequestInterceptor',
	        value: function addRequestInterceptor(interceptor) {
	            this.requestInterceptors.push(interceptor);
	        }
	    }, {
	        key: 'addResponseInterceptor',
	        value: function addResponseInterceptor(interceptor) {
	            this.responseInterceptors.push(interceptor);
	        }
	    }, {
	        key: 'getCount',

	        /**
	         * @param {string} name
	         * @param {string} params As decoded from the query string, e.g. { sort: "name", filter: {enabled:true}, slice: [10, 20] }
	         */
	        value: function getCount(name, params) {
	            return this.collections[name].getCount(params);
	        }
	    }, {
	        key: 'getAll',

	        /**
	         * @param {string} name
	         * @param {string} params As decoded from the query string, e.g. { sort: "name", filter: {enabled:true}, slice: [10, 20] }
	         */
	        value: function getAll(name, params) {
	            return this.collections[name].getAll(params);
	        }
	    }, {
	        key: 'getOne',
	        value: function getOne(name, identifier, params) {
	            return this.collections[name].getOne(identifier, params);
	        }
	    }, {
	        key: 'addOne',
	        value: function addOne(name, item) {
	            return this.collections[name].addOne(item);
	        }
	    }, {
	        key: 'updateOne',
	        value: function updateOne(name, identifier, item) {
	            return this.collections[name].updateOne(identifier, item);
	        }
	    }, {
	        key: 'removeOne',
	        value: function removeOne(name, identifier) {
	            return this.collections[name].removeOne(identifier);
	        }
	    }, {
	        key: 'getOnly',
	        value: function getOnly(name, params) {
	            return this.singles[name].getOnly();
	        }
	    }, {
	        key: 'updateOnly',
	        value: function updateOnly(name, item) {
	            return this.singles[name].updateOnly(item);
	        }
	    }, {
	        key: 'decode',
	        value: function decode(request) {
	            request.queryString = decodeURIComponent(request.url.slice(request.url.indexOf('?') + 1));
	            request.params = (0, _parseQueryString2['default'])(request.queryString);
	            if (request.requestBody) {
	                try {
	                    request.json = JSON.parse(request.requestBody);
	                } catch (error) {}
	            }
	            return this.requestInterceptors.reduce(function (previous, current) {
	                return current(previous);
	            }, request);
	        }
	    }, {
	        key: 'respond',
	        value: function respond(body, headers, request) {
	            var status = arguments.length <= 3 || arguments[3] === undefined ? 200 : arguments[3];

	            if (!headers) {
	                headers = {};
	            }
	            if (!headers['Content-Type']) {
	                headers['Content-Type'] = 'application/json';
	            }
	            var response = { status: status, headers: headers, body: body };
	            response = this.responseInterceptors.reduce(function (previous, current) {
	                return current(previous, request);
	            }, response);
	            this.log(request, response);

	            return request.respond(response.status, response.headers, JSON.stringify(response.body));
	        }
	    }, {
	        key: 'log',
	        value: function log(request, response) {
	            if (!this.loggingEnabled) return;
	            if (console.group) {
	                // Better logging in Chrome
	                console.groupCollapsed(request.method, request.url, '(FakeRest)');
	                console.group('request');
	                console.log(request.method, request.url);
	                console.log('headers', request.requestHeaders);
	                console.log('body   ', request.requestBody);
	                console.groupEnd();
	                console.group('response', response.status);
	                console.log('headers', response.headers);
	                console.log('body   ', response.body);
	                console.groupEnd();
	                console.groupEnd();
	            } else {
	                console.log('FakeRest request ', request.method, request.url, 'headers', request.requestHeaders, 'body', request.requestBody);
	                console.log('FakeRest response', response.status, 'headers', response.headers, 'body', response.body);
	            }
	        }
	    }, {
	        key: 'batch',
	        value: function batch(request) {

	            var json = request.json;
	            var handle = this.handle.bind(this);

	            var jsonResponse = _Object$keys(json).reduce(function (jsonResponse, requestName) {
	                var subResponse;
	                var sub = {
	                    url: json[requestName],
	                    method: 'GET',
	                    params: {},
	                    respond: function respond(code, headers, body) {
	                        subResponse = {
	                            code: code,
	                            headers: _Object$keys(headers || {}).map(function (headerName) {
	                                return {
	                                    'name': headerName,
	                                    'value': headers[headerName]
	                                };
	                            }),
	                            body: body || {}
	                        };
	                    }
	                };
	                handle(sub);

	                jsonResponse[requestName] = subResponse || {
	                    code: 404,
	                    headers: [],
	                    body: {}
	                };

	                return jsonResponse;
	            }, {});

	            return this.respond(jsonResponse, {}, request, 200);
	        }
	    }, {
	        key: 'handle',

	        /**
	         * @param {FakeXMLHttpRequest} request
	         *
	         * String request.url The URL set on the request object.
	         * String request.method The request method as a string.
	         * Object request.requestHeaders An object of all request headers, i.e.:
	         *     {
	         *         "Accept": "text/html",
	         *         "Connection": "keep-alive"
	         *     }
	         * String request.requestBody The request body
	         * String request.username Username, if any.
	         * String request.password Password, if any.
	         */
	        value: function handle(request) {
	            request = this.decode(request);

	            if (this.batchUrl && this.batchUrl === request.url && request.method === 'POST') {
	                return this.batch(request);
	            }

	            // Handle Single Objects
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = _getIterator(this.getSingleNames()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var _name2 = _step.value;

	                    var matches = request.url.match(new RegExp('^' + this.baseUrl + '\\/(' + _name2 + ')(\\/?.*)?$'));
	                    if (!matches) continue;

	                    if (request.method == 'GET') {
	                        try {
	                            var item = this.getOnly(_name2);
	                            return this.respond(item, null, request);
	                        } catch (error) {
	                            return request.respond(404);
	                        }
	                    }
	                    if (request.method == 'PUT') {
	                        try {
	                            var item = this.updateOnly(_name2, request.json);
	                            return this.respond(item, null, request);
	                        } catch (error) {
	                            return request.respond(404);
	                        }
	                    }
	                    if (request.method == 'PATCH') {
	                        try {
	                            var item = this.updateOnly(_name2, request.json);
	                            return this.respond(item, null, request);
	                        } catch (error) {
	                            return request.respond(404);
	                        }
	                    }
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator['return']) {
	                        _iterator['return']();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            // Handle collections
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = _getIterator(this.getCollectionNames()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var _name3 = _step2.value;

	                    var matches = request.url.match(new RegExp('^' + this.baseUrl + '\\/(' + _name3 + ')(\\/(\\d+))?(\\?.*)?$'));
	                    if (!matches) continue;
	                    var params = assign({}, this.defaultQuery(_name3), request.params);
	                    if (!matches[2]) {
	                        if (request.method == 'GET') {
	                            var count = this.getCount(_name3, params.filter ? { filter: params.filter } : {});
	                            var items = undefined,
	                                contentRange = undefined,
	                                _status = undefined;
	                            if (count > 0) {
	                                items = this.getAll(_name3, params);
	                                var first = params.range ? params.range[0] : 0;
	                                var last = params.range ? Math.min(items.length - 1 + first, params.range[1]) : items.length - 1;
	                                contentRange = 'items ' + first + '-' + last + '/' + count;
	                                _status = items.length == count ? 200 : 206;
	                            } else {
	                                items = [];
	                                contentRange = 'items */0';
	                                _status = 200;
	                            }
	                            return this.respond(items, { 'Content-Range': contentRange }, request, _status);
	                        }
	                        if (request.method == 'POST') {
	                            var newResource = this.addOne(_name3, request.json);
	                            var newResourceURI = this.baseUrl + '/' + _name3 + '/' + newResource[this.getCollection(_name3).identifierName];
	                            return this.respond(newResource, { Location: newResourceURI }, request, 201);
	                        }
	                    } else {
	                        var id = matches[3];
	                        if (request.method == 'GET') {
	                            try {
	                                var item = this.getOne(_name3, id, params);
	                                return this.respond(item, null, request);
	                            } catch (error) {
	                                return request.respond(404);
	                            }
	                        }
	                        if (request.method == 'PUT') {
	                            try {
	                                var item = this.updateOne(_name3, id, request.json);
	                                return this.respond(item, null, request);
	                            } catch (error) {
	                                return request.respond(404);
	                            }
	                        }
	                        if (request.method == 'PATCH') {
	                            try {
	                                var item = this.updateOne(_name3, id, request.json);
	                                return this.respond(item, null, request);
	                            } catch (error) {
	                                return request.respond(404);
	                            }
	                        }
	                        if (request.method == 'DELETE') {
	                            try {
	                                var item = this.removeOne(_name3, id);
	                                return this.respond(item, null, request);
	                            } catch (error) {
	                                return request.respond(404);
	                            }
	                        }
	                    }
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                        _iterator2['return']();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'getHandler',
	        value: function getHandler() {
	            return this.handle.bind(this);
	        }
	    }]);

	    return Server;
	})();

	exports['default'] = Server;
	module.exports = exports['default'];

	// body isn't JSON, skipping

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = __webpack_require__(11)['default'];

	var _inherits = __webpack_require__(12)['default'];

	var _createClass = __webpack_require__(6)['default'];

	var _classCallCheck = __webpack_require__(7)['default'];

	var _getIterator = __webpack_require__(9)['default'];

	var _interopRequireDefault = __webpack_require__(5)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _objectAssign = __webpack_require__(13);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _Server2 = __webpack_require__(1);

	var _Server3 = _interopRequireDefault(_Server2);

	var _Collection = __webpack_require__(3);

	var _Collection2 = _interopRequireDefault(_Collection);

	var _Single = __webpack_require__(4);

	var _Single2 = _interopRequireDefault(_Single);

	var _parseQueryString = __webpack_require__(10);

	var _parseQueryString2 = _interopRequireDefault(_parseQueryString);

	var assign = _objectAssign2['default'].getPolyfill();

	var FetchServer = (function (_Server) {
	    _inherits(FetchServer, _Server);

	    function FetchServer() {
	        _classCallCheck(this, FetchServer);

	        _get(Object.getPrototypeOf(FetchServer.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(FetchServer, [{
	        key: 'decode',
	        value: function decode(request, opts) {
	            var _this = this;

	            var req = typeof request === 'string' ? new Request(request, opts) : request;
	            req.queryString = decodeURIComponent(req.url.slice(req.url.indexOf('?') + 1));
	            req.params = (0, _parseQueryString2['default'])(req.queryString);
	            return req.text().then(function (text) {
	                req.requestBody = text;
	                try {
	                    req.requestJson = JSON.parse(text);
	                } catch (e) {}
	            }).then(function () {
	                return _this.requestInterceptors.reduce(function (previous, current) {
	                    return current(previous);
	                }, req);
	            });
	        }
	    }, {
	        key: 'respond',
	        value: function respond(response, request) {
	            response = this.responseInterceptors.reduce(function (previous, current) {
	                return current(previous, request);
	            }, response);
	            this.log(request, response);

	            return response;
	        }
	    }, {
	        key: 'log',
	        value: function log(request, response) {
	            if (!this.loggingEnabled) return;
	            if (console.group) {
	                // Better logging in Chrome
	                console.groupCollapsed(request.method, request.url, '(FakeRest)');
	                console.group('request');
	                console.log(request.method, request.url);
	                console.log('headers', request.requestHeaders);
	                console.log('body   ', request.requestBody);
	                console.groupEnd();
	                console.group('response', response.status);
	                console.log('headers', response.headers);
	                console.log('body   ', response.body);
	                console.groupEnd();
	                console.groupEnd();
	            } else {
	                console.log('FakeRest request ', request.method, request.url, 'headers', request.requestHeaders, 'body', request.requestBody);
	                console.log('FakeRest response', response.status, 'headers', response.headers, 'body', response.body);
	            }
	        }
	    }, {
	        key: 'batch',
	        value: function batch(request) {
	            throw new Error('not implemented');
	        }
	    }, {
	        key: 'handle',

	        /**
	         * @param {Request} fetch request
	         * @param {Object} options
	         *
	         */
	        value: function handle(req, opts) {
	            var _this2 = this;

	            return this.decode(req, opts).then(function (request) {
	                var response = {
	                    headers: { 'Content-Type': 'application/json' },
	                    status: 200
	                };

	                // handle batch request
	                if (_this2.batchUrl && _this2.batchUrl === request.url && request.method === 'POST') {
	                    return _this2.batch(request);
	                }

	                // Handle Single Objects
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = _getIterator(_this2.getSingleNames()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var _name = _step.value;

	                        var matches = request.url.match(new RegExp('^' + _this2.baseUrl + '\\/(' + _name + ')(\\/?.*)?$'));
	                        if (!matches) continue;

	                        if (request.method == 'GET') {
	                            try {
	                                response.body = _this2.getOnly(_name);
	                            } catch (error) {
	                                reponse.status = 404;
	                            }
	                            return _this2.respond(response, request);
	                        }
	                        if (request.method == 'PUT') {
	                            try {
	                                response.body = _this2.updateOnly(_name, request.requestJson);
	                            } catch (error) {
	                                reponse.status = 404;
	                            }
	                            return _this2.respond(response, request);
	                        }
	                        if (request.method == 'PATCH') {
	                            try {
	                                response.body = _this2.updateOnly(_name, request.requestJson);
	                            } catch (error) {
	                                reponse.status = 404;
	                            }
	                            return _this2.respond(response, request);
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator['return']) {
	                            _iterator['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                // handle collections
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = _getIterator(_this2.getCollectionNames()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var _name2 = _step2.value;

	                        var matches = request.url.match(new RegExp('^' + _this2.baseUrl + '\\/(' + _name2 + ')(\\/(\\d+))?(\\?.*)?$'));
	                        if (!matches) continue;
	                        var params = assign({}, _this2.defaultQuery(_name2), request.params);
	                        if (!matches[2]) {
	                            if (request.method == 'GET') {
	                                var count = _this2.getCount(_name2, params.filter ? { filter: params.filter } : {});
	                                if (count > 0) {
	                                    var items = _this2.getAll(_name2, params);
	                                    var first = params.range ? params.range[0] : 0;
	                                    var last = params.range ? Math.min(items.length - 1 + first, params.range[1]) : items.length - 1;
	                                    response.body = items;
	                                    response.headers['Content-Range'] = 'items ' + first + '-' + last + '/' + count;
	                                    response.status = items.length == count ? 200 : 206;
	                                } else {
	                                    response.body = [];
	                                    response.headers['Content-Range'] = 'items */0';
	                                }
	                                return _this2.respond(response, request);
	                            }
	                            if (request.method == 'POST') {
	                                var newResource = _this2.addOne(_name2, request.requestJson);
	                                var newResourceURI = _this2.baseUrl + '/' + _name2 + '/' + newResource[_this2.getCollection(_name2).identifierName];
	                                response.body = newResource;
	                                response.headers['Location'] = newResourceURI;
	                                response.status = 201;
	                                return _this2.respond(response, request);
	                            }
	                        } else {
	                            var id = matches[3];
	                            if (request.method == 'GET') {
	                                try {
	                                    response.body = _this2.getOne(_name2, id, params);
	                                } catch (error) {
	                                    response.status = 404;
	                                }
	                                return _this2.respond(response, request);
	                            }
	                            if (request.method == 'PUT') {
	                                try {
	                                    response.body = _this2.updateOne(_name2, id, request.requestJson);
	                                } catch (error) {
	                                    response.status = 404;
	                                }
	                                return _this2.respond(response, request);
	                            }
	                            if (request.method == 'PATCH') {
	                                try {
	                                    response.body = _this2.updateOne(_name2, id, request.requestJson);
	                                } catch (error) {
	                                    response.status = 404;
	                                }
	                                return _this2.respond(response, request);
	                            }
	                            if (request.method == 'DELETE') {
	                                try {
	                                    response.body = _this2.removeOne(_name2, id);
	                                } catch (error) {
	                                    response.status = 404;
	                                }
	                                return _this2.respond(response, request);
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError2 = true;
	                    _iteratorError2 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                            _iterator2['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError2) {
	                            throw _iteratorError2;
	                        }
	                    }
	                }

	                return _this2.respond(response, request);
	            });
	        }
	    }]);

	    return FetchServer;
	})(_Server3['default']);

	exports['default'] = FetchServer;
	module.exports = exports['default'];

	// not JSON, no big deal

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(6)['default'];

	var _classCallCheck = __webpack_require__(7)['default'];

	var _Object$keys = __webpack_require__(8)['default'];

	var _interopRequireDefault = __webpack_require__(5)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _objectAssign = __webpack_require__(13);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	__webpack_require__(14);

	__webpack_require__(16);

	function filterItems(items, filter) {
	    if (typeof filter === 'function') {
	        return items.filter(filter);
	    }
	    if (filter instanceof Object) {
	        // turn filter properties to functions
	        var filterFunctions = _Object$keys(filter).map(function (key) {
	            if (key === 'q') {
	                var _ret = (function () {
	                    var regex = new RegExp(filter.q, 'i');
	                    // full-text filter
	                    return {
	                        v: function (item) {
	                            for (var itemKey in item) {
	                                if (item[itemKey] && item[itemKey].match && item[itemKey].match(regex) !== null) return true;
	                            }
	                            return false;
	                        }
	                    };
	                })();

	                if (typeof _ret === 'object') return _ret.v;
	            }
	            var value = filter[key];
	            if (key.indexOf('_lte') !== -1) {
	                var _ret2 = (function () {
	                    // less than or equal
	                    var realKey = key.replace(/(_lte)$/, '');
	                    return {
	                        v: function (item) {
	                            return item[realKey] <= value;
	                        }
	                    };
	                })();

	                if (typeof _ret2 === 'object') return _ret2.v;
	            }
	            if (key.indexOf('_gte') !== -1) {
	                var _ret3 = (function () {
	                    // less than or equal
	                    var realKey = key.replace(/(_gte)$/, '');
	                    return {
	                        v: function (item) {
	                            return item[realKey] >= value;
	                        }
	                    };
	                })();

	                if (typeof _ret3 === 'object') return _ret3.v;
	            }
	            if (key.indexOf('_lt') !== -1) {
	                var _ret4 = (function () {
	                    // less than or equal
	                    var realKey = key.replace(/(_lt)$/, '');
	                    return {
	                        v: function (item) {
	                            return item[realKey] < value;
	                        }
	                    };
	                })();

	                if (typeof _ret4 === 'object') return _ret4.v;
	            }
	            if (key.indexOf('_gt') !== -1) {
	                var _ret5 = (function () {
	                    // less than or equal
	                    var realKey = key.replace(/(_gt)$/, '');
	                    return {
	                        v: function (item) {
	                            return item[realKey] > value;
	                        }
	                    };
	                })();

	                if (typeof _ret5 === 'object') return _ret5.v;
	            }
	            if (Array.isArray(value)) {
	                // where item in value
	                return function (item) {
	                    return value.filter(function (v) {
	                        return v == item[key];
	                    }).length > 0;
	                };
	            }
	            return function (item) {
	                if (Array.isArray(item[key]) && typeof value == 'string') {
	                    // simple filter but array item value: where value in item
	                    return item[key].indexOf(value) !== -1;
	                }
	                if (typeof item[key] == 'boolean' && typeof value == 'string') {
	                    // simple filter but boolean item value: boolean where
	                    return item[key] == (value === 'true' ? true : false);
	                }
	                // simple filter
	                return item[key] == value;
	            };
	        });
	        // only the items matching all filters functions are in (AND logic)
	        return items.filter(function (item) {
	            return filterFunctions.reduce(function (selected, filterFunction) {
	                return selected && filterFunction(item);
	            }, true);
	        });
	    }
	    throw new Error('Unsupported filter type');
	}

	function sortItems(items, sort) {
	    if (typeof sort === 'function') {
	        return items.sort(sort);
	    }
	    if (typeof sort === 'string') {
	        return items.sort(function (a, b) {
	            if (a[sort] > b[sort]) {
	                return 1;
	            }
	            if (a[sort] < b[sort]) {
	                return -1;
	            }
	            return 0;
	        });
	    }
	    if (Array.isArray(sort)) {
	        var _ret6 = (function () {
	            var key = sort[0];
	            var direction = sort[1].toLowerCase() == 'asc' ? 1 : -1;
	            return {
	                v: items.sort(function (a, b) {
	                    if (a[key] > b[key]) {
	                        return direction;
	                    }
	                    if (a[key] < b[key]) {
	                        return -1 * direction;
	                    }
	                    return 0;
	                })
	            };
	        })();

	        if (typeof _ret6 === 'object') return _ret6.v;
	    }
	    throw new Error('Unsupported sort type');
	}

	function rangeItems(items, range) {
	    if (Array.isArray(range)) {
	        return items.slice(range[0], range[1] !== undefined ? range[1] + 1 : undefined);
	    }
	    throw new Error('Unsupported range type');
	}

	var Collection = (function () {
	    function Collection() {
	        var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	        var identifierName = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];

	        _classCallCheck(this, Collection);

	        if (!Array.isArray(items)) {
	            throw new Error('Can\'t initialize a Collection with anything else than an array of items');
	        }
	        this.sequence = 0; // id of the next item
	        this.identifierName = identifierName;
	        this.items = [];
	        this.server = null;
	        this.name = null;
	        items.map(this.addOne.bind(this));
	    }

	    _createClass(Collection, [{
	        key: 'setServer',

	        /**
	         * A Collection may need to access other collections (e.g. for embedding references)
	         * This is done through a reference to the parent server.
	         */
	        value: function setServer(server) {
	            this.server = server;
	        }
	    }, {
	        key: 'setName',
	        value: function setName(name) {
	            this.name = name;
	        }
	    }, {
	        key: '_oneToManyEmbedder',

	        /**
	         * Get a one to many embedder function for a given resource name
	         *
	         * @example embed posts for an author
	         *
	         *     authorsCollection._oneToManyEmbedder('posts')
	         *
	         * @returns Function item => item
	         */
	        value: function _oneToManyEmbedder(resourceName) {
	            var _this = this;

	            var singularResourceName = this.name.slice(0, -1);
	            var referenceName = singularResourceName + '_id';
	            return function (item) {
	                var otherCollection = _this.server.collections[resourceName];
	                if (!otherCollection) throw new Error('Can\'t embed a non-existing collection ' + resourceName);
	                if (Array.isArray(item[resourceName])) {
	                    // the many to one relationship is carried by an array of ids, e.g. { posts: [1, 2] } in authors
	                    item[resourceName] = otherCollection.getAll({
	                        filter: function filter(i) {
	                            return item[resourceName].indexOf(i[otherCollection.identifierName]) !== -1;
	                        }
	                    });
	                } else {
	                    // the many to one relationship is carried by references in the related collection, e.g. { author_id: 1 } in posts
	                    item[resourceName] = otherCollection.getAll({
	                        filter: function filter(i) {
	                            return i[referenceName] == item[_this.identifierName];
	                        }
	                    });
	                }
	                return item;
	            };
	        }
	    }, {
	        key: '_manyToOneEmbedder',

	        /**
	         * Get a many to one embedder function for a given resource name
	         *
	         * @example embed author for a post
	         *
	         *     postsCollection._manyToOneEmbedder('author')
	         *
	         * @returns Function item => item
	         */
	        value: function _manyToOneEmbedder(resourceName) {
	            var _this2 = this;

	            var pluralResourceName = resourceName + 's';
	            var referenceName = resourceName + '_id';
	            return function (item) {
	                var otherCollection = _this2.server.collections[pluralResourceName];
	                if (!otherCollection) throw new Error('Can\'t embed a non-existing collection ' + resourceName);
	                try {
	                    item[resourceName] = otherCollection.getOne(item[referenceName]);
	                } catch (e) {}
	                return item;
	            };
	        }
	    }, {
	        key: '_itemEmbedder',

	        /**
	         * @param String[] An array of resource names, e.g. ['books', 'country']
	         * @returns Function item => item
	         */
	        value: function _itemEmbedder(embed) {
	            var _this3 = this;

	            var resourceNames = Array.isArray(embed) ? embed : [embed];
	            var resourceEmbedders = resourceNames.map(function (resourceName) {
	                return resourceName.endsWith('s') ? _this3._oneToManyEmbedder(resourceName) : _this3._manyToOneEmbedder(resourceName);
	            });
	            return function (item) {
	                return resourceEmbedders.reduce(function (itemWithEmbeds, embedder) {
	                    return embedder(itemWithEmbeds);
	                }, item);
	            };
	        }
	    }, {
	        key: 'getCount',
	        value: function getCount(query) {
	            return this.getAll(query).length;
	        }
	    }, {
	        key: 'getAll',
	        value: function getAll(query) {
	            var items = this.items.slice(0); // clone the array to avoid updating the core one
	            if (query) {
	                if (query.filter) {
	                    items = filterItems(items, query.filter);
	                }
	                if (query.sort) {
	                    items = sortItems(items, query.sort);
	                }
	                if (query.range) {
	                    items = rangeItems(items, query.range);
	                }
	                if (query.embed && this.server) {
	                    items = items.map(function (item) {
	                        return (0, _objectAssign2['default'])({}, item);
	                    }) // clone item to avoid updating the original
	                    .map(this._itemEmbedder(query.embed)); // embed reference
	                }
	            }
	            return items;
	        }
	    }, {
	        key: 'getIndex',
	        value: function getIndex(identifier) {
	            var _this4 = this;

	            return this.items.findIndex(function (item) {
	                return item[_this4.identifierName] == identifier;
	            });
	        }
	    }, {
	        key: 'getOne',
	        value: function getOne(identifier, query) {
	            var index = this.getIndex(identifier);
	            if (index === -1) {
	                throw new Error('No item with identifier ' + identifier);
	            }
	            var item = this.items[index];
	            if (query && query.embed && this.server) {
	                item = (0, _objectAssign2['default'])({}, item); // clone item to avoid updating the original
	                item = this._itemEmbedder(query.embed)(item); // embed reference
	            }
	            return item;
	        }
	    }, {
	        key: 'addOne',
	        value: function addOne(item) {
	            var identifier = item[this.identifierName];
	            if (identifier !== undefined) {
	                if (this.getIndex(identifier) !== -1) {
	                    throw new Error('An item with the identifier ' + identifier + ' already exists');
	                } else {
	                    this.sequence = Math.max(this.sequence, identifier) + 1;
	                }
	            } else {
	                item[this.identifierName] = this.sequence++;
	            }
	            this.items.push(item);
	            return item;
	        }
	    }, {
	        key: 'updateOne',
	        value: function updateOne(identifier, item) {
	            var index = this.getIndex(identifier);
	            if (index === -1) {
	                throw new Error('No item with identifier ' + identifier);
	            }
	            for (var key in item) {
	                this.items[index][key] = item[key];
	            }
	            return this.items[index];
	        }
	    }, {
	        key: 'removeOne',
	        value: function removeOne(identifier) {
	            var index = this.getIndex(identifier);
	            if (index === -1) {
	                throw new Error('No item with identifier ' + identifier);
	            }
	            var item = this.items[index];
	            this.items.splice(index, 1);
	            if (identifier == this.sequence - 1) {
	                this.sequence--;
	            }
	            return item;
	        }
	    }]);

	    return Collection;
	})();

	exports['default'] = Collection;
	module.exports = exports['default'];

	// resource doesn't exist in the related collection - do not embed

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(6)['default'];

	var _classCallCheck = __webpack_require__(7)['default'];

	var _interopRequireDefault = __webpack_require__(5)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _objectAssign = __webpack_require__(13);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	__webpack_require__(16);

	var Single = (function () {
	    function Single(obj) {
	        _classCallCheck(this, Single);

	        if (!(obj instanceof Object)) {
	            throw new Error('Can\'t initialize a Single with anything except an object');
	        }
	        this.obj = obj;
	        this.server = null;
	        this.name = null;
	    }

	    _createClass(Single, [{
	        key: 'setServer',

	        /**
	         * A Single may need to access other collections (e.g. for embedded
	         * references) This is done through a reference to the parent server.
	         */
	        value: function setServer(server) {
	            this.server = server;
	        }
	    }, {
	        key: 'setName',
	        value: function setName(name) {
	            this.name = name;
	        }
	    }, {
	        key: '_oneToManyEmbedder',

	        // No need to embed Singles, since they are by their nature top-level
	        // No need to worry about remote references, (i.e. mysingleton_id=1) since
	        // it is by definition a singleton
	        value: function _oneToManyEmbedder(resourceName) {
	            var _this = this;

	            return function (item) {
	                var otherCollection = _this.server.collections[resourceName];
	                if (!otherCollection) throw new Error('Can\'t embed a non-existing collection ' + resourceName);
	                // We have an array of ids {posts: [1,2]} (back refs are not valid
	                // for singleton)
	                item[resourceName] = otherCollection.getAll({
	                    filter: function filter(i) {
	                        return item[resourceName].indexOf(i[otherCollection.identifierName]) !== -1;
	                    }
	                });
	                return item;
	            };
	        }
	    }, {
	        key: '_manyToOneEmbedder',
	        value: function _manyToOneEmbedder(resourceName) {
	            var _this2 = this;

	            var pluralResourceName = resourceName + 's';
	            var referenceName = resourceName + '_id';
	            return function (item) {
	                var otherCollection = _this2.server.collections[pluralResourceName];
	                if (!otherCollection) throw new Error('Can\'t embed a non-existing collection ' + resourceName);
	                try {
	                    item[resourceName] = otherCollection.getOne(item[referenceName]);
	                } catch (e) {}
	                return item;
	            };
	        }
	    }, {
	        key: '_itemEmbedder',
	        value: function _itemEmbedder(embed) {
	            var _this3 = this;

	            var resourceNames = Array.isArray(embed) ? embed : [embed];
	            var resourceEmbedders = resourceNames.map(function (resourceName) {
	                return resourceName.endsWith('s') ? _this3._oneToManyEmbedder(resourceName) : _this3._manyToOneEmbedder(resourceName);
	            });
	            return function (item) {
	                return resourceEmbedders.reduce(function (itemWithEmbeds, embedder) {
	                    return embedder(itemWithEmbeds);
	                }, item);
	            };
	        }
	    }, {
	        key: 'getOnly',
	        value: function getOnly(query) {
	            var item = this.obj;
	            if (query && query.embed && this.server) {
	                item = (0, _objectAssign2['default'])({}, item); // Clone
	                item = this._itemEmbedder(query.embed)(item);
	            }
	            return item;
	        }
	    }, {
	        key: 'updateOnly',
	        value: function updateOnly(item) {
	            for (var key in item) {
	                this.obj[key] = item[key];
	            }
	            return this.obj;
	        }
	    }]);

	    return Single;
	})();

	exports['default'] = Single;
	module.exports = exports['default'];

	// Resource doesn't exist, so don't embed

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(15)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(24), __esModule: true };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(23), __esModule: true };

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = __webpack_require__(17)['default'];

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = parseQueryString;

	function parseQueryString(queryString) {
	    if (!queryString) {
	        return {};
	    }
	    var queryObject = {};
	    var queryElements = queryString.split('&');

	    queryElements.map(function (queryElement) {
	        if (queryElement.indexOf('=') === -1) {
	            queryObject[queryElement] = true;
	        } else {
	            var _queryElement$split = queryElement.split('=');

	            var _queryElement$split2 = _slicedToArray(_queryElement$split, 2);

	            var key = _queryElement$split2[0];
	            var value = _queryElement$split2[1];

	            if (value.indexOf('[') === 0 || value.indexOf('{') === 0) {
	                value = JSON.parse(value);
	            }
	            queryObject[key.trim()] = value;
	        }
	    });

	    return queryObject;
	}

	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$getOwnPropertyDescriptor = __webpack_require__(18)["default"];

	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;

	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    desc = parent = getter = undefined;
	    _again = false;
	    if (object === null) object = Function.prototype;

	    var desc = _Object$getOwnPropertyDescriptor(object, property);

	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);

	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;

	      if (getter === undefined) {
	        return undefined;
	      }

	      return getter.call(receiver);
	    }
	  }
	};

	exports.__esModule = true;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$create = __webpack_require__(19)["default"];

	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) subClass.__proto__ = superClass;
	};

	exports.__esModule = true;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var defineProperties = __webpack_require__(29);

	var implementation = __webpack_require__(20);
	var getPolyfill = __webpack_require__(21);
	var shim = __webpack_require__(22);

	defineProperties(implementation, {
		implementation: implementation,
		getPolyfill: getPolyfill,
		shim: shim
	});

	module.exports = implementation;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Array.prototype.findIndex - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
	// For all details and docs: <https://github.com/paulmillr/Array.prototype.findIndex>
	(function (globals) {
	  if (Array.prototype.findIndex) return;

	  var findIndex = function(predicate) {
	    var list = Object(this);
	    var length = Math.max(0, list.length) >>> 0; // ES.ToUint32;
	    if (length === 0) return -1;
	    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
	      throw new TypeError('Array#findIndex: predicate must be a function');
	    }
	    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
	    for (var i = 0; i < length; i++) {
	      if (predicate.call(thisArg, list[i], i, list)) return i;
	    }
	    return -1;
	  };

	  if (Object.defineProperty) {
	    try {
	      Object.defineProperty(Array.prototype, 'findIndex', {
	        value: findIndex, configurable: true, writable: true
	      });
	    } catch(e) {}
	  }

	  if (!Array.prototype.findIndex) {
	    Array.prototype.findIndex = findIndex;
	  }
	}(this));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(25), __esModule: true };

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*! http://mths.be/endswith v0.2.0 by @mathias */
	if (!String.prototype.endsWith) {
		(function() {
			'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var toString = {}.toString;
			var endsWith = function(search) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				if (search && toString.call(search) == '[object RegExp]') {
					throw TypeError();
				}
				var stringLength = string.length;
				var searchString = String(search);
				var searchLength = searchString.length;
				var pos = stringLength;
				if (arguments.length > 1) {
					var position = arguments[1];
					if (position !== undefined) {
						// `ToInteger`
						pos = position ? Number(position) : 0;
						if (pos != pos) { // better `isNaN`
							pos = 0;
						}
					}
				}
				var end = Math.min(Math.max(pos, 0), stringLength);
				var start = end - searchLength;
				if (start < 0) {
					return false;
				}
				var index = -1;
				while (++index < searchLength) {
					if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
						return false;
					}
				}
				return true;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'endsWith', {
					'value': endsWith,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.endsWith = endsWith;
			}
		}());
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator = __webpack_require__(9)["default"];

	var _isIterable = __webpack_require__(26)["default"];

	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(27), __esModule: true };

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(28), __esModule: true };

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// modified from https://github.com/es-shims/es6-shim
	var keys = __webpack_require__(37);
	var bind = __webpack_require__(38);
	var canBeObject = function (obj) {
		return typeof obj !== 'undefined' && obj !== null;
	};
	var hasSymbols = __webpack_require__(30)();
	var toObject = Object;
	var push = bind.call(Function.call, Array.prototype.push);
	var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);

	module.exports = function assign(target, source1) {
		if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
		var objTarget = toObject(target);
		var s, source, i, props, syms;
		for (s = 1; s < arguments.length; ++s) {
			source = toObject(arguments[s]);
			props = keys(source);
			if (hasSymbols && Object.getOwnPropertySymbols) {
				syms = Object.getOwnPropertySymbols(source);
				for (i = 0; i < syms.length; ++i) {
					if (propIsEnumerable(source, syms[i])) {
						push(props, syms[i]);
					}
				}
			}
			for (i = 0; i < props.length; ++i) {
				objTarget[props[i]] = source[props[i]];
			}
		}
		return objTarget;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var implementation = __webpack_require__(20);

	var assignHasPendingExceptions = function () {
		if (!Object.assign || !Object.preventExtensions) {
			return false;
		}
		// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
		// which is 72% slower than our shim, and Firefox 40's native implementation.
		var thrower = Object.preventExtensions({ 1: 2 });
		try {
			Object.assign(thrower, 'xy');
		} catch (e) {
			return thrower[1] === 'y';
		}
	};

	module.exports = function getPolyfill() {
		return !Object.assign || assignHasPendingExceptions() ? implementation : Object.assign;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var define = __webpack_require__(29);
	var getPolyfill = __webpack_require__(21);

	module.exports = function shimAssign() {
		var polyfill = getPolyfill();
		if (Object.assign !== polyfill) {
			define(Object, { assign: polyfill });
		}
		return polyfill;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	module.exports = __webpack_require__(31).core.getIterator;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	module.exports = __webpack_require__(31).core.Object.keys;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(31);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(36), __esModule: true };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(31);
	__webpack_require__(35);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(31);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(37);
	var foreach = __webpack_require__(39);
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

	var toStr = Object.prototype.toString;

	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
	};

	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			Object.defineProperty(obj, 'x', { value: obj, enumerable: false });
	        /* eslint-disable no-unused-vars */
	        for (var _ in obj) { return false; }
	        /* eslint-enable no-unused-vars */
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: value
			});
		} else {
			object[name] = value;
		}
	};

	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) {
			props = props.concat(Object.getOwnPropertySymbols(map));
		}
		foreach(props, function (name) {
			defineProperty(object, name, map[name], predicates[name]);
		});
	};

	defineProperties.supportsDescriptors = !!supportsDescriptors;

	module.exports = defineProperties;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(37);

	module.exports = function hasSymbols() {
		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
		if (typeof Symbol.iterator === 'symbol') { return true; }

		var obj = {};
		var sym = Symbol('test');
		if (typeof sym === 'string') { return false; }
		if (sym instanceof Symbol) { return false; }
		obj[sym] = 42;
		for (sym in obj) { return false; }
		if (keys(obj).length !== 0) { return false; }
		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) { return false; }

		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

		if (typeof Object.getOwnPropertyDescriptor === 'function') {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== 42 || descriptor.enumerable !== true) { return false; }
		}

		return true;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}

	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}

	var $ = module.exports = __webpack_require__(44)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	var $           = __webpack_require__(31)
	  , Iterators   = __webpack_require__(42).Iterators
	  , ITERATOR    = __webpack_require__(46)('iterator')
	  , ArrayValues = Iterators.Array
	  , NL          = $.g.NodeList
	  , HTC         = $.g.HTMLCollection
	  , NLProto     = NL && NL.prototype
	  , HTCProto    = HTC && HTC.prototype;
	if($.FW){
	  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
	  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
	}
	Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var set   = __webpack_require__(31).set
	  , $at   = __webpack_require__(40)(true)
	  , ITER  = __webpack_require__(41).safe('iter')
	  , $iter = __webpack_require__(42)
	  , step  = $iter.step;

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(43)(String, 'String', function(iterated){
	  set(this, ITER, {o: String(iterated), i: 0});
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , index = iter.i
	    , point;
	  if(index >= O.length)return step(1);
	  point = $at(O, index);
	  iter.i += point.length;
	  return step(0, point);
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(31).core
	  , $iter = __webpack_require__(42);
	core.isIterable  = $iter.is;
	core.getIterator = $iter.get;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(31)
	  , $def     = __webpack_require__(47)
	  , isObject = $.isObject
	  , toObject = $.toObject;
	$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
	  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
	, function(KEY, ID){
	  var fn     = ($.core.Object || {})[KEY] || Object[KEY]
	    , forced = 0
	    , method = {};
	  method[KEY] = ID == 0 ? function freeze(it){
	    return isObject(it) ? fn(it) : it;
	  } : ID == 1 ? function seal(it){
	    return isObject(it) ? fn(it) : it;
	  } : ID == 2 ? function preventExtensions(it){
	    return isObject(it) ? fn(it) : it;
	  } : ID == 3 ? function isFrozen(it){
	    return isObject(it) ? fn(it) : true;
	  } : ID == 4 ? function isSealed(it){
	    return isObject(it) ? fn(it) : true;
	  } : ID == 5 ? function isExtensible(it){
	    return isObject(it) ? fn(it) : false;
	  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
	    return fn(toObject(it), key);
	  } : ID == 7 ? function getPrototypeOf(it){
	    return fn(Object($.assertDefined(it)));
	  } : ID == 8 ? function keys(it){
	    return fn(toObject(it));
	  } : __webpack_require__(48).get;
	  try {
	    fn('z');
	  } catch(e){
	    forced = 1;
	  }
	  $def($def.S + $def.F * forced, 'Object', method);
	});

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	module.exports = __webpack_require__(31).core.isIterable;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArgs = __webpack_require__(49);
	var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
	var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var blacklistedKeys = {
		$window: true,
		$console: true,
		$parent: true,
		$self: true,
		$frames: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' && !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	var keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};

	keysShim.shim = function shimObjectKeys() {
		if (!Object.keys) {
			Object.keys = keysShim;
		} else {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2));
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		}
		return Object.keys || keysShim;
	};

	module.exports = keysShim;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';

	module.exports = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);

	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};



/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {


	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	module.exports = function forEach (obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};



/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var $ = __webpack_require__(31);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String($.assertDefined(that))
	      , i = $.toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var sid = 0;
	function uid(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
	}
	uid.safe = __webpack_require__(31).g.Symbol || uid;
	module.exports = uid;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $                 = __webpack_require__(31)
	  , cof               = __webpack_require__(50)
	  , classof           = cof.classof
	  , assert            = __webpack_require__(51)
	  , assertObject      = assert.obj
	  , SYMBOL_ITERATOR   = __webpack_require__(46)('iterator')
	  , FF_ITERATOR       = '@@iterator'
	  , Iterators         = __webpack_require__(52)('iterators')
	  , IteratorPrototype = {};
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	setIterator(IteratorPrototype, $.that);
	function setIterator(O, value){
	  $.hide(O, SYMBOL_ITERATOR, value);
	  // Add iterator for FF iterator protocol
	  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
	}

	module.exports = {
	  // Safari has buggy iterators w/o `next`
	  BUGGY: 'keys' in [] && !('next' in [].keys()),
	  Iterators: Iterators,
	  step: function(done, value){
	    return {value: value, done: !!done};
	  },
	  is: function(it){
	    var O      = Object(it)
	      , Symbol = $.g.Symbol;
	    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
	      || SYMBOL_ITERATOR in O
	      || $.has(Iterators, classof(O));
	  },
	  get: function(it){
	    var Symbol = $.g.Symbol
	      , getIter;
	    if(it != undefined){
	      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
	        || it[SYMBOL_ITERATOR]
	        || Iterators[classof(it)];
	    }
	    assert($.isFunction(getIter), it, ' is not iterable!');
	    return assertObject(getIter.call(it));
	  },
	  set: setIterator,
	  create: function(Constructor, NAME, next, proto){
	    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
	    cof.set(Constructor, NAME + ' Iterator');
	  }
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var $def            = __webpack_require__(47)
	  , $redef          = __webpack_require__(54)
	  , $               = __webpack_require__(31)
	  , cof             = __webpack_require__(50)
	  , $iter           = __webpack_require__(42)
	  , SYMBOL_ITERATOR = __webpack_require__(46)('iterator')
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values'
	  , Iterators       = $iter.Iterators;
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  $iter.create(Constructor, NAME, next);
	  function createMethod(kind){
	    function $$(that){
	      return new Constructor(that, kind);
	    }
	    switch(kind){
	      case KEYS: return function keys(){ return $$(this); };
	      case VALUES: return function values(){ return $$(this); };
	    } return function entries(){ return $$(this); };
	  }
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = $.getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    cof.set(IteratorPrototype, TAG, true);
	    // FF fix
	    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
	  }
	  // Define iterator
	  if($.FW || FORCE)$iter.set(proto, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = $.that;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function($){
	  $.FW   = false;
	  $.path = $.core;
	  return $;
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(31)
	  , setUnscope = __webpack_require__(53)
	  , ITER       = __webpack_require__(41).safe('iter')
	  , $iter      = __webpack_require__(42)
	  , step       = $iter.step
	  , Iterators  = $iter.Iterators;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(43)(Array, 'Array', function(iterated, kind){
	  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , kind  = iter.k
	    , index = iter.i++;
	  if(!O || index >= O.length){
	    iter.o = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(31).g
	  , store  = __webpack_require__(52)('wks');
	module.exports = function(name){
	  return store[name] || (store[name] =
	    global.Symbol && global.Symbol[name] || __webpack_require__(41).safe('Symbol.' + name));
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(31)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && !isFunction(target[key]))exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp.prototype = C.prototype;
	    }(out);
	    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
	  }
	}
	module.exports = $def;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var $ = __webpack_require__(31)
	  , toString = {}.toString
	  , getNames = $.getNames;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	function getWindowNames(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	}

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames($.toObject(it));
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toStr = Object.prototype.toString;

	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(31)
	  , TAG      = __webpack_require__(46)('toStringTag')
	  , toString = {}.toString;
	function cof(it){
	  return toString.call(it).slice(8, -1);
	}
	cof.classof = function(it){
	  var O, T;
	  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
	};
	cof.set = function(it, tag, stat){
	  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
	};
	module.exports = cof;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(31);
	function assert(condition, msg1, msg2){
	  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
	}
	assert.def = $.assertDefined;
	assert.fn = function(it){
	  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
	  return it;
	};
	assert.obj = function(it){
	  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};
	assert.inst = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};
	module.exports = assert;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var $      = __webpack_require__(31)
	  , SHARED = '__core-js_shared__'
	  , store  = $.g[SHARED] || ($.g[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31).hide;

/***/ }
/******/ ])
});
;
