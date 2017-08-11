'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SET_FILTER = exports.SET_PAGE = exports.SORT_DESC = exports.SORT_ASC = exports.SET_SORT = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SET_SORT = exports.SET_SORT = 'SET_SORT';
var SORT_ASC = exports.SORT_ASC = 'ASC';
var SORT_DESC = exports.SORT_DESC = 'DESC';

var SET_PAGE = exports.SET_PAGE = 'SET_PAGE';

var SET_FILTER = exports.SET_FILTER = 'SET_FILTER';

var oppositeOrder = function oppositeOrder(direction) {
    return direction === SORT_DESC ? SORT_ASC : SORT_DESC;
};

/**
 * This reducer is for the react-router query string, NOT for redux.
 */

exports.default = function (previousState, _ref) {
    var type = _ref.type,
        payload = _ref.payload;

    switch (type) {
        case SET_SORT:
            if (payload === previousState.sort) {
                return (0, _extends3.default)({}, previousState, {
                    order: oppositeOrder(previousState.order),
                    page: 1
                });
            }

            return (0, _extends3.default)({}, previousState, {
                sort: payload,
                order: SORT_ASC,
                page: 1
            });

        case SET_PAGE:
            return (0, _extends3.default)({}, previousState, { page: payload });

        case SET_FILTER:
            {
                return (0, _extends3.default)({}, previousState, { page: 1, filter: payload });
            }

        default:
            return previousState;
    }
};