'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resource = exports.CrudRoute = exports.AdminRoutes = exports.Admin = exports.FieldTitle = exports.fetchUtils = exports.queryReducer = exports.localeReducer = exports.adminReducer = undefined;

var _actions = require('./actions');

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _auth = require('./auth');

Object.keys(_auth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _auth[key];
    }
  });
});

var _i18n = require('./i18n');

Object.keys(_i18n).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _i18n[key];
    }
  });
});

var _mui = require('./mui');

Object.keys(_mui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mui[key];
    }
  });
});

var _rest = require('./rest');

Object.keys(_rest).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _rest[key];
    }
  });
});

var _saga = require('./sideEffect/saga');

Object.keys(_saga).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _saga[key];
    }
  });
});

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _locale = require('./reducer/locale');

var _locale2 = _interopRequireDefault(_locale);

var _queryReducer2 = require('./reducer/resource/list/queryReducer');

var _queryReducer3 = _interopRequireDefault(_queryReducer2);

var _fetch = require('./util/fetch');

var _fetchUtils = _interopRequireWildcard(_fetch);

var _FieldTitle2 = require('./util/FieldTitle');

var _FieldTitle3 = _interopRequireDefault(_FieldTitle2);

var _Admin2 = require('./Admin');

var _Admin3 = _interopRequireDefault(_Admin2);

var _AdminRoutes2 = require('./AdminRoutes');

var _AdminRoutes3 = _interopRequireDefault(_AdminRoutes2);

var _CrudRoute2 = require('./CrudRoute');

var _CrudRoute3 = _interopRequireDefault(_CrudRoute2);

var _Resource2 = require('./Resource');

var _Resource3 = _interopRequireDefault(_Resource2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.adminReducer = _reducer2.default;
exports.localeReducer = _locale2.default;
exports.queryReducer = _queryReducer3.default;
exports.fetchUtils = _fetchUtils;
exports.FieldTitle = _FieldTitle3.default;
exports.Admin = _Admin3.default;
exports.AdminRoutes = _AdminRoutes3.default;
exports.CrudRoute = _CrudRoute3.default;
exports.Resource = _Resource3.default;