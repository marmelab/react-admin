'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _effects = require('redux-saga/effects');

var _fetchActions = require('../../actions/fetchActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crudFetch = function crudFetch(restClient) {
    var _marked = [handleFetch].map(_regenerator2.default.mark);

    function handleFetch(action) {
        var type, payload, _action$meta, fetchMeta, meta, restType, response;

        return _regenerator2.default.wrap(function handleFetch$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        type = action.type, payload = action.payload, _action$meta = action.meta, fetchMeta = _action$meta.fetch, meta = (0, _objectWithoutProperties3.default)(_action$meta, ['fetch']);
                        restType = fetchMeta;
                        _context.next = 4;
                        return (0, _effects.all)([(0, _effects.put)({ type: type + '_LOADING', payload: payload, meta: meta }), (0, _effects.put)({ type: _fetchActions.FETCH_START })]);

                    case 4:
                        response = void 0;
                        _context.prev = 5;
                        _context.next = 8;
                        return (0, _effects.call)(restClient, restType, meta.resource, payload);

                    case 8:
                        response = _context.sent;

                        if (response.data) {
                            _context.next = 11;
                            break;
                        }

                        throw new Error('REST response must contain a data key');

                    case 11:
                        _context.next = 13;
                        return (0, _effects.put)({
                            type: type + '_SUCCESS',
                            payload: response,
                            requestPayload: payload,
                            meta: (0, _extends3.default)({}, meta, { fetchResponse: restType, fetchStatus: _fetchActions.FETCH_END })
                        });

                    case 13:
                        _context.next = 15;
                        return (0, _effects.put)({ type: _fetchActions.FETCH_END });

                    case 15:
                        _context.next = 23;
                        break;

                    case 17:
                        _context.prev = 17;
                        _context.t0 = _context['catch'](5);
                        _context.next = 21;
                        return (0, _effects.put)({
                            type: type + '_FAILURE',
                            error: _context.t0.message ? _context.t0.message : _context.t0,
                            requestPayload: payload,
                            meta: (0, _extends3.default)({}, meta, { fetchResponse: restType, fetchStatus: _fetchActions.FETCH_ERROR })
                        });

                    case 21:
                        _context.next = 23;
                        return (0, _effects.put)({ type: _fetchActions.FETCH_ERROR, error: _context.t0 });

                    case 23:
                        _context.prev = 23;
                        _context.next = 26;
                        return (0, _effects.cancelled)();

                    case 26:
                        if (!_context.sent) {
                            _context.next = 30;
                            break;
                        }

                        _context.next = 29;
                        return (0, _effects.put)({ type: _fetchActions.FETCH_CANCEL });

                    case 29:
                        return _context.abrupt('return');

                    case 30:
                        return _context.finish(23);

                    case 31:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _marked[0], this, [[5, 17, 23, 31]]);
    }

    return _regenerator2.default.mark(function watchCrudFetch() {
        return _regenerator2.default.wrap(function watchCrudFetch$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _effects.all)([(0, _effects.takeLatest)(function (action) {
                            return action.meta && action.meta.fetch && action.meta.cancelPrevious;
                        }, handleFetch), (0, _effects.takeEvery)(function (action) {
                            return action.meta && action.meta.fetch && !action.meta.cancelPrevious;
                        }, handleFetch)]);

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, watchCrudFetch, this);
    });
};

exports.default = crudFetch;
module.exports = exports['default'];