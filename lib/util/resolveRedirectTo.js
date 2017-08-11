'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _linkToRecord = require('./linkToRecord');

var _linkToRecord2 = _interopRequireDefault(_linkToRecord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (redirectTo, basePath, id) {
    switch (redirectTo) {
        case 'list':
            return basePath;
        case 'create':
            return basePath + '/create';
        case 'edit':
            return (0, _linkToRecord2.default)(basePath, id);
        case 'show':
            return (0, _linkToRecord2.default)(basePath, id) + '/show';
        default:
            return redirectTo;
    }
};

module.exports = exports['default'];