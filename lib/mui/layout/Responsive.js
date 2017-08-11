'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Responsive = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _withWidth = require('material-ui/utils/withWidth');

var _withWidth2 = _interopRequireDefault(_withWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Responsive = function Responsive(_ref) {
    var small = _ref.small,
        medium = _ref.medium,
        large = _ref.large,
        width = _ref.width,
        rest = (0, _objectWithoutProperties3.default)(_ref, ['small', 'medium', 'large', 'width']);

    var component = void 0;
    switch (width) {
        case 1:
            component = small ? small : medium ? medium : large;
            break;
        case 2:
            component = medium ? medium : large ? large : small;
            break;
        case 3:
            component = large ? large : medium ? medium : small;
            break;
        default:
            throw new Error('Unknown width ' + width);
    }
    return _react2.default.cloneElement(component, rest);
};

exports.Responsive = Responsive;
Responsive.propTypes = {
    small: _propTypes2.default.element,
    medium: _propTypes2.default.element,
    large: _propTypes2.default.element,
    width: _propTypes2.default.number
};

exports.default = (0, _withWidth2.default)()(Responsive);