'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Restricted = undefined;

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

var _Restricted2 = require('./Restricted');

var _Restricted3 = _interopRequireDefault(_Restricted2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Restricted = _Restricted3.default;