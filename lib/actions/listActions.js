'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CRUD_CHANGE_LIST_PARAMS = exports.CRUD_CHANGE_LIST_PARAMS = 'AOR/CRUD_CHANGE_LIST_PARAMS';

var changeListParams = exports.changeListParams = function changeListParams(resource, params) {
    return {
        type: CRUD_CHANGE_LIST_PARAMS,
        payload: params,
        meta: { resource: resource }
    };
};