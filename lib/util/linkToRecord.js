"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (basePath, id) {
    return basePath + "/" + encodeURIComponent(id);
};

module.exports = exports["default"];