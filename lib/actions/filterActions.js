'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CRUD_SHOW_FILTER = exports.CRUD_SHOW_FILTER = 'AOR/CRUD_SHOW_FILTER';
var CRUD_HIDE_FILTER = exports.CRUD_HIDE_FILTER = 'AOR/CRUD_HIDE_FILTER';
var CRUD_SET_FILTER = exports.CRUD_SET_FILTER = 'AOR/CRUD_SET_FILTER';

var showFilter = exports.showFilter = function showFilter(resource, field) {
    return {
        type: CRUD_SHOW_FILTER,
        payload: { field: field },
        meta: { resource: resource }
    };
};

var hideFilter = exports.hideFilter = function hideFilter(resource, field) {
    return {
        type: CRUD_HIDE_FILTER,
        payload: { field: field },
        meta: { resource: resource }
    };
};

var setFilter = exports.setFilter = function setFilter(resource, field, value) {
    return {
        type: CRUD_SET_FILTER,
        payload: { field: field, value: value },
        meta: { resource: resource }
    };
};