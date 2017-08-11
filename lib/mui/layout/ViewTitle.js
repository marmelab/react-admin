'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Card = require('material-ui/Card');

var _withWidth = require('material-ui/utils/withWidth');

var _withWidth2 = _interopRequireDefault(_withWidth);

var _AppBarMobile = require('./AppBarMobile');

var _AppBarMobile2 = _interopRequireDefault(_AppBarMobile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewTitle = function ViewTitle(_ref) {
    var title = _ref.title,
        width = _ref.width;
    return width === 1 ? _react2.default.createElement(_AppBarMobile2.default, { title: title }) : _react2.default.createElement(_Card.CardTitle, { title: title, className: 'title' });
};

exports.default = (0, _withWidth2.default)()(ViewTitle);
module.exports = exports['default'];