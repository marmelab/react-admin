'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _viewList = require('material-ui/svg-icons/action/view-list');

var _viewList2 = _interopRequireDefault(_viewList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentPropType = _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]);

var Resource = function Resource() {
    return _react2.default.createElement(
        'span',
        null,
        '<Resource> elements are for configuration only and should not be rendered'
    );
};

Resource.propTypes = {
    name: _propTypes2.default.string.isRequired,
    list: componentPropType,
    create: componentPropType,
    edit: componentPropType,
    show: componentPropType,
    remove: componentPropType,
    icon: componentPropType,
    options: _propTypes2.default.object,
    checkCredentials: _propTypes2.default.func
};

Resource.defaultProps = {
    icon: _viewList2.default,
    options: {}
};

exports.default = Resource;
module.exports = exports['default'];