'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslationProvider = exports.translate = exports.englishMessages = exports.DEFAULT_LOCALE = undefined;

var _TranslationUtils = require('./TranslationUtils');

Object.keys(_TranslationUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TranslationUtils[key];
    }
  });
});

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _translate2 = require('./translate');

var _translate3 = _interopRequireDefault(_translate2);

var _TranslationProvider2 = require('./TranslationProvider');

var _TranslationProvider3 = _interopRequireDefault(_TranslationProvider2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_LOCALE = exports.DEFAULT_LOCALE = 'en';

exports.englishMessages = _messages2.default;
exports.translate = _translate3.default;
exports.TranslationProvider = _TranslationProvider3.default;