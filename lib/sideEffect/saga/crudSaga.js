'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _crudFetch = require('./crudFetch');

var _crudFetch2 = _interopRequireDefault(_crudFetch);

var _crudResponse = require('./crudResponse');

var _crudResponse2 = _interopRequireDefault(_crudResponse);

var _referenceFetch = require('./referenceFetch');

var _referenceFetch2 = _interopRequireDefault(_referenceFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} restClient A REST object with two methods: fetch() and convertResponse()
 */
exports.default = function (restClient, authClient) {
    return _regenerator2.default.mark(function crudSaga() {
        return _regenerator2.default.wrap(function crudSaga$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _effects.all)([(0, _auth2.default)(authClient)(), (0, _crudFetch2.default)(restClient)(), (0, _crudResponse2.default)(), (0, _referenceFetch2.default)()]);

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, crudSaga, this);
    });
};

module.exports = exports['default'];