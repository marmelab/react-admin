'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getIds = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _dataActions = require('../../../actions/dataActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (resource) {
    return function () {
        var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var _ref = arguments[1];
        var type = _ref.type,
            payload = _ref.payload,
            requestPayload = _ref.requestPayload,
            meta = _ref.meta;

        if (!meta || meta.resource !== resource) {
            return previousState;
        }
        switch (type) {
            case _dataActions.CRUD_GET_LIST_SUCCESS:
                return payload.data.map(function (record) {
                    return record.id;
                });
            case _dataActions.CRUD_DELETE_SUCCESS:
                {
                    var index = previousState.findIndex(function (el) {
                        return el == requestPayload.id;
                    }); // eslint-disable-line eqeqeq
                    if (index === -1) {
                        return previousState;
                    }
                    return [].concat((0, _toConsumableArray3.default)(previousState.slice(0, index)), (0, _toConsumableArray3.default)(previousState.slice(index + 1)));
                }
            default:
                return previousState;
        }
    };
};

var getIds = exports.getIds = function getIds(state) {
    return state;
};