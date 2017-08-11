'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crudGetManyAccumulate = exports.CRUD_GET_MANY_ACCUMULATE = undefined;

var _dataActions = require('./dataActions');

var CRUD_GET_MANY_ACCUMULATE = exports.CRUD_GET_MANY_ACCUMULATE = 'AOR/CRUD_GET_MANY_ACCUMULATE';

var crudGetManyAccumulate = exports.crudGetManyAccumulate = function crudGetManyAccumulate(resource, ids) {
    return {
        type: CRUD_GET_MANY_ACCUMULATE,
        payload: { resource: resource, ids: ids },
        meta: { accumulate: _dataActions.crudGetMany }
    };
};