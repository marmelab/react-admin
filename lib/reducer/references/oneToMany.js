'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nameRelatedTo = exports.getReferencesByIds = exports.getReferences = exports.getIds = undefined;

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
        case _dataActions.CRUD_GET_MANY_REFERENCE_SUCCESS:
            return (0, _extends4.default)({}, previousState, (0, _defineProperty3.default)({}, meta.relatedTo, payload.data.map(function (record) {
                return record.id;
            })));
        default:
            return previousState;
    }
};

var getIds = exports.getIds = function getIds(state, relatedTo) {
    return state.admin.references.oneToMany[relatedTo];
};

var getReferences = exports.getReferences = function getReferences(state, reference, relatedTo) {
    var ids = getIds(state, relatedTo);
    if (typeof ids === 'undefined') return undefined;
    return ids.map(function (id) {
        return state.admin[reference].data[id];
    }).filter(function (r) {
        return typeof r !== 'undefined';
    }).reduce(function (prev, record) {
        prev[record.id] = record; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
};

var getReferencesByIds = exports.getReferencesByIds = function getReferencesByIds(state, reference, ids) {
    if (ids.length === 0) return {};
    return ids.map(function (id) {
        return state.admin[reference].data[id];
    }).filter(function (r) {
        return typeof r !== 'undefined';
    }).reduce(function (prev, record) {
        prev[record.id] = record; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
};

var nameRelatedTo = exports.nameRelatedTo = function nameRelatedTo(reference, id, resource, target) {
    return resource + '_' + reference + '@' + target + '_' + id;
};