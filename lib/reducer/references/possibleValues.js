'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPossibleReferences = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _dataActions = require('../../actions/dataActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

exports.default = function () {
    var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var _ref = arguments[1];
    var type = _ref.type,
        payload = _ref.payload,
        meta = _ref.meta;

    switch (type) {
        case _dataActions.CRUD_GET_MATCHING_SUCCESS:
            return (0, _extends4.default)({}, previousState, (0, _defineProperty3.default)({}, meta.relatedTo, payload.data.map(function (record) {
                return record.id;
            })));
        default:
            return previousState;
    }
};

var getPossibleReferences = exports.getPossibleReferences = function getPossibleReferences(state, referenceSource, reference) {
    var selectedIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var possibleValues = state.admin.references.possibleValues[referenceSource] ? Array.from(state.admin.references.possibleValues[referenceSource]) : [];
    selectedIds.forEach(function (id) {
        return possibleValues.some(function (value) {
            return value == id;
        }) || possibleValues.unshift(id);
    });
    return possibleValues.map(function (id) {
        return state.admin[reference].data[id];
    }).filter(function (r) {
        return typeof r !== 'undefined';
    });
};