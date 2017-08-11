'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _reactRouterRedux = require('react-router-redux');

var _notificationActions = require('../../actions/notificationActions');

var _authActions = require('../../actions/authActions');

var _fetchActions = require('../../actions/fetchActions');

var _auth = require('../../auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (authClient) {
    var _marked = [handleAuth].map(_regenerator2.default.mark);

    if (!authClient) return function () {
        return null;
    };
    function handleAuth(action) {
        var type, payload, error, meta, authPayload, errorMessage;
        return _regenerator2.default.wrap(function handleAuth$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        type = action.type, payload = action.payload, error = action.error, meta = action.meta;
                        _context.t0 = type;
                        _context.next = _context.t0 === _authActions.USER_LOGIN ? 4 : _context.t0 === _authActions.USER_CHECK ? 24 : _context.t0 === _authActions.USER_LOGOUT ? 36 : _context.t0 === _fetchActions.FETCH_ERROR ? 41 : 55;
                        break;

                    case 4:
                        _context.prev = 4;
                        _context.next = 7;
                        return (0, _effects.put)({ type: _authActions.USER_LOGIN_LOADING });

                    case 7:
                        _context.next = 9;
                        return (0, _effects.call)(authClient, _auth.AUTH_LOGIN, payload);

                    case 9:
                        authPayload = _context.sent;
                        _context.next = 12;
                        return (0, _effects.put)({ type: _authActions.USER_LOGIN_SUCCESS, payload: authPayload });

                    case 12:
                        _context.next = 14;
                        return (0, _effects.put)((0, _reactRouterRedux.push)(meta.pathName || '/'));

                    case 14:
                        _context.next = 23;
                        break;

                    case 16:
                        _context.prev = 16;
                        _context.t1 = _context['catch'](4);
                        _context.next = 20;
                        return (0, _effects.put)({ type: _authActions.USER_LOGIN_FAILURE, error: _context.t1, meta: { auth: true } });

                    case 20:
                        errorMessage = typeof _context.t1 === 'string' ? _context.t1 : typeof _context.t1 === 'undefined' || !_context.t1.message ? 'aor.auth.sign_in_error' : _context.t1.message;
                        _context.next = 23;
                        return (0, _effects.put)((0, _notificationActions.showNotification)(errorMessage, 'warning'));

                    case 23:
                        return _context.abrupt('break', 55);

                    case 24:
                        _context.prev = 24;
                        _context.next = 27;
                        return (0, _effects.call)(authClient, _auth.AUTH_CHECK, payload);

                    case 27:
                        _context.next = 35;
                        break;

                    case 29:
                        _context.prev = 29;
                        _context.t2 = _context['catch'](24);
                        _context.next = 33;
                        return (0, _effects.call)(authClient, _auth.AUTH_LOGOUT);

                    case 33:
                        _context.next = 35;
                        return (0, _effects.put)((0, _reactRouterRedux.replace)({
                            pathname: _context.t2 && _context.t2.redirectTo || '/login',
                            state: { nextPathname: meta.pathName }
                        }));

                    case 35:
                        return _context.abrupt('break', 55);

                    case 36:
                        _context.next = 38;
                        return (0, _effects.call)(authClient, _auth.AUTH_LOGOUT);

                    case 38:
                        _context.next = 40;
                        return (0, _effects.put)((0, _reactRouterRedux.push)('/login'));

                    case 40:
                        return _context.abrupt('break', 55);

                    case 41:
                        _context.prev = 41;
                        _context.next = 44;
                        return (0, _effects.call)(authClient, _auth.AUTH_ERROR, error);

                    case 44:
                        _context.next = 54;
                        break;

                    case 46:
                        _context.prev = 46;
                        _context.t3 = _context['catch'](41);
                        _context.next = 50;
                        return (0, _effects.call)(authClient, _auth.AUTH_LOGOUT);

                    case 50:
                        _context.next = 52;
                        return (0, _effects.put)((0, _reactRouterRedux.push)('/login'));

                    case 52:
                        _context.next = 54;
                        return (0, _effects.put)((0, _notificationActions.hideNotification)());

                    case 54:
                        return _context.abrupt('break', 55);

                    case 55:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _marked[0], this, [[4, 16], [24, 29], [41, 46]]);
    }
    return _regenerator2.default.mark(function watchAuthActions() {
        return _regenerator2.default.wrap(function watchAuthActions$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _effects.all)([(0, _effects.takeEvery)(function (action) {
                            return action.meta && action.meta.auth;
                        }, handleAuth), (0, _effects.takeEvery)(_fetchActions.FETCH_ERROR, handleAuth)]);

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, watchAuthActions, this);
    });
};

module.exports = exports['default'];