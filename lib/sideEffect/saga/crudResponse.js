'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = _callee;

var _effects = require('redux-saga/effects');

var _reactRouterRedux = require('react-router-redux');

var _dataActions = require('../../actions/dataActions');

var _notificationActions = require('../../actions/notificationActions');

var _resolveRedirectTo = require('../../util/resolveRedirectTo');

var _resolveRedirectTo2 = _interopRequireDefault(_resolveRedirectTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [handleResponse, _callee].map(_regenerator2.default.mark);

/**
 * Side effects for fetch responses
 *
 * Mostly redirects and notifications
 */
function handleResponse(_ref) {
    var type = _ref.type,
        requestPayload = _ref.requestPayload,
        error = _ref.error,
        payload = _ref.payload;
    var errorMessage;
    return _regenerator2.default.wrap(function handleResponse$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.t0 = type;
                    _context.next = _context.t0 === _dataActions.CRUD_UPDATE_SUCCESS ? 3 : _context.t0 === _dataActions.CRUD_CREATE_SUCCESS ? 13 : _context.t0 === _dataActions.CRUD_DELETE_SUCCESS ? 23 : _context.t0 === _dataActions.CRUD_GET_ONE_FAILURE ? 33 : _context.t0 === _dataActions.CRUD_GET_LIST_FAILURE ? 43 : _context.t0 === _dataActions.CRUD_GET_MANY_FAILURE ? 43 : _context.t0 === _dataActions.CRUD_GET_MANY_REFERENCE_FAILURE ? 43 : _context.t0 === _dataActions.CRUD_CREATE_FAILURE ? 43 : _context.t0 === _dataActions.CRUD_UPDATE_FAILURE ? 43 : _context.t0 === _dataActions.CRUD_DELETE_FAILURE ? 43 : 48;
                    break;

                case 3:
                    if (!requestPayload.redirectTo) {
                        _context.next = 9;
                        break;
                    }

                    _context.next = 6;
                    return (0, _effects.all)([(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.updated')), (0, _effects.put)((0, _reactRouterRedux.push)((0, _resolveRedirectTo2.default)(requestPayload.redirectTo, requestPayload.basePath, requestPayload.id)))]);

                case 6:
                    _context.t1 = _context.sent;
                    _context.next = 12;
                    break;

                case 9:
                    _context.next = 11;
                    return [(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.updated'))];

                case 11:
                    _context.t1 = _context.sent;

                case 12:
                    return _context.abrupt('return', _context.t1);

                case 13:
                    if (!requestPayload.redirectTo) {
                        _context.next = 19;
                        break;
                    }

                    _context.next = 16;
                    return (0, _effects.all)([(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.created')), (0, _effects.put)((0, _reactRouterRedux.push)((0, _resolveRedirectTo2.default)(requestPayload.redirectTo, requestPayload.basePath, payload.data.id)))]);

                case 16:
                    _context.t2 = _context.sent;
                    _context.next = 22;
                    break;

                case 19:
                    _context.next = 21;
                    return [(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.created'))];

                case 21:
                    _context.t2 = _context.sent;

                case 22:
                    return _context.abrupt('return', _context.t2);

                case 23:
                    if (!requestPayload.redirectTo) {
                        _context.next = 29;
                        break;
                    }

                    _context.next = 26;
                    return (0, _effects.all)([(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.deleted')), (0, _effects.put)((0, _reactRouterRedux.push)((0, _resolveRedirectTo2.default)(requestPayload.redirectTo, requestPayload.basePath, requestPayload.id)))]);

                case 26:
                    _context.t3 = _context.sent;
                    _context.next = 32;
                    break;

                case 29:
                    _context.next = 31;
                    return [(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.deleted'))];

                case 31:
                    _context.t3 = _context.sent;

                case 32:
                    return _context.abrupt('return', _context.t3);

                case 33:
                    if (!requestPayload.basePath) {
                        _context.next = 39;
                        break;
                    }

                    _context.next = 36;
                    return (0, _effects.all)([(0, _effects.put)((0, _notificationActions.showNotification)('aor.notification.item_doesnt_exist', 'warning')), (0, _effects.put)((0, _reactRouterRedux.push)(requestPayload.basePath))]);

                case 36:
                    _context.t4 = _context.sent;
                    _context.next = 42;
                    break;

                case 39:
                    _context.next = 41;
                    return (0, _effects.all)([]);

                case 41:
                    _context.t4 = _context.sent;

                case 42:
                    return _context.abrupt('return', _context.t4);

                case 43:
                    console.error(error);
                    errorMessage = typeof error === 'string' ? error : error.message || 'aor.notification.http_error';
                    _context.next = 47;
                    return (0, _effects.put)((0, _notificationActions.showNotification)(errorMessage, 'warning'));

                case 47:
                    return _context.abrupt('return', _context.sent);

                case 48:
                    _context.next = 50;
                    return (0, _effects.all)([]);

                case 50:
                    return _context.abrupt('return', _context.sent);

                case 51:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.takeEvery)(function (action) {
                        return action.meta && action.meta.fetchResponse;
                    }, handleResponse);

                case 2:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this);
}
module.exports = exports['default'];