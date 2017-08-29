'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRecord = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fetchActions = require('../../actions/fetchActions');

var _types = require('../../rest/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The data state is an instance pool, which keeps track of the fetch date of each instance.
 *
 * @example
 * {
 *   23: { id: 23, title: 'War and Peace' },
 *   67: { id: 67, title: 'Anna Karenina' },
 *   fetchedAt: { // non enumerable
 *     23: new Date('2016-08-05T19:33:15.012Z'),
 *     67: new Date('2016-08-05T19:33:43.449Z'),
 *   },
 * }
 */

var cacheDuration = 10 * 60 * 1000; // ten minutes

/**
 * Add new records to the pool, and remove outdated ones.
 *
 * This is the equivalent of a stale-while-revalidate caching strategy:
 * The cached data is displayed before fetching, and stale data is removed
 * only once fresh data is fetched.
 */
var addRecords = function addRecords() {
    var newRecords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var oldRecords = arguments[1];

    // prepare new records and timestamp them
    var newRecordsById = newRecords.reduce(function (prev, record) {
        prev[record.id] = record; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    var now = new Date();
    var newRecordsFetchedAt = newRecords.reduce(function (prev, record) {
        prev[record.id] = now; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    // remove outdated old records
    var latestValidDate = new Date();
    latestValidDate.setTime(latestValidDate.getTime() - cacheDuration);
    var oldValidRecordIds = oldRecords.fetchedAt ? Object.keys(oldRecords.fetchedAt).filter(function (id) {
        return oldRecords.fetchedAt[id] > latestValidDate;
    }) : [];
    var oldValidRecords = oldValidRecordIds.reduce(function (prev, id) {
        prev[id] = oldRecords[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    var oldValidRecordsFetchedAt = oldValidRecordIds.reduce(function (prev, id) {
        prev[id] = oldRecords.fetchedAt[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    // combine old records and new records
    var records = (0, _extends3.default)({}, oldValidRecords, newRecordsById);
    Object.defineProperty(records, 'fetchedAt', { value: (0, _extends3.default)({}, oldValidRecordsFetchedAt, newRecordsFetchedAt) }); // non enumerable by default
    return records;
};

var initialState = {};
Object.defineProperty(initialState, 'fetchedAt', { value: {} }); // non enumerable by default

exports.default = function (resource) {
    return function () {
        var previousState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var _ref = arguments[1];
        var payload = _ref.payload,
            meta = _ref.meta;

        if (!meta || meta.resource !== resource) {
            return previousState;
        }
        if (!meta.fetchResponse || meta.fetchStatus !== _fetchActions.FETCH_END) {
            return previousState;
        }
        switch (meta.fetchResponse) {
            case _types.GET_LIST:
            case _types.GET_MANY:
            case _types.GET_MANY_REFERENCE:
                return addRecords(payload.data, previousState);
            case _types.GET_ONE:
            case _types.UPDATE:
            case _types.CREATE:
                return addRecords([payload.data], previousState);
            default:
                return previousState;
        }
    };
};

var getRecord = exports.getRecord = function getRecord(state, id) {
    return state[id];
};