'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonServerRestClient = exports.simpleRestClient = undefined;

var _types = require('./types');

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

var _simple = require('./simple');

var _simple2 = _interopRequireDefault(_simple);

var _jsonServer = require('./jsonServer');

var _jsonServer2 = _interopRequireDefault(_jsonServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.simpleRestClient = _simple2.default;
exports.jsonServerRestClient = _jsonServer2.default;