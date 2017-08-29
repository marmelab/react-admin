'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Card = require('material-ui/Card');

var _button = require('../button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right'
};

var CreateActions = function CreateActions(_ref) {
    var basePath = _ref.basePath;
    return _react2.default.createElement(
        _Card.CardActions,
        { style: cardActionStyle },
        _react2.default.createElement(_button.ListButton, { basePath: basePath })
    );
};

exports.default = CreateActions;
module.exports = exports['default'];