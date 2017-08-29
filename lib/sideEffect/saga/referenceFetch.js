'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = _callee;

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(finalize),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(accumulate),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(_callee);

/**
 * Example
 *
 * let debouncedIds = {
 *   posts: { 4: true, 7: true, 345: true },
 *   authors: { 23: true, 47: true, 78: true },
 * }
 */
var debouncedIds = {};
var addIds = function addIds(resource, ids) {
    if (!debouncedIds[resource]) {
        debouncedIds[resource] = {};
    }
    ids.forEach(function (id) {
        debouncedIds[resource][id] = true;
    }); // fast UNIQUE
};
var getIds = function getIds(resource) {
    var ids = Object.keys(debouncedIds[resource]);
    delete debouncedIds[resource];
    return ids;
};

var tasks = {};

/**
 * Fetch the list of accumulated ids after a delay
 *
 * As this gets canceled by subsequent calls to accumulate(), only the last
 * call to finalize() will not be canceled. The delay acts as a
 * debounce.
 *
 * @see http://yelouafi.github.io/redux-saga/docs/recipes/index.html#debouncing
 */
function finalize(resource, actionCreator) {
    return _regenerator2.default.wrap(function finalize$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.call)(_reduxSaga.delay, 50);

                case 2:
                    _context.next = 4;
                    return (0, _effects.put)(actionCreator(resource, getIds(resource)));

                case 4:
                    delete tasks[resource];

                case 5:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}

/**
 * Cancel call to finalize, accumulate ids, and call finalize
 *
 * @example
 * accumulate({ type: CRUD_GET_MANY_ACCUMULATE, payload: { ids: [1, 3, 5], resource: 'posts' } })
 */
function accumulate(_ref) {
    var payload = _ref.payload,
        meta = _ref.meta;
    var ids, resource;
    return _regenerator2.default.wrap(function accumulate$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    ids = payload.ids, resource = payload.resource;

                    if (!tasks[resource]) {
                        _context2.next = 4;
                        break;
                    }

                    _context2.next = 4;
                    return (0, _effects.cancel)(tasks[resource]);

                case 4:
                    addIds(resource, ids);
                    _context2.next = 7;
                    return (0, _effects.fork)(finalize, resource, meta.accumulate);

                case 7:
                    tasks[resource] = _context2.sent;

                case 8:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked2, this);
}

function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return (0, _effects.takeEvery)(function (action) {
                        return action.meta && action.meta.accumulate;
                    }, accumulate);

                case 2:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked3, this);
}
module.exports = exports['default'];