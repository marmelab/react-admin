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

var ShowActions = function ShowActions(_ref) {
    var basePath = _ref.basePath,
        data = _ref.data,
        hasDelete = _ref.hasDelete,
        hasEdit = _ref.hasEdit,
        refresh = _ref.refresh;
    return _react2.default.createElement(
        _Card.CardActions,
        { style: cardActionStyle },
        hasEdit && _react2.default.createElement(_button.EditButton, { basePath: basePath, record: data }),
        _react2.default.createElement(_button.ListButton, { basePath: basePath }),
        hasDelete && _react2.default.createElement(_button.DeleteButton, { basePath: basePath, record: data }),
        _react2.default.createElement(_button.RefreshButton, { refresh: refresh })
    );
};

exports.default = ShowActions;
module.exports = exports['default'];