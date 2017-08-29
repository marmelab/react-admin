'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileInputPreview = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _colors = require('material-ui/styles/colors');

var _removeCircle = require('material-ui/svg-icons/content/remove-circle');

var _removeCircle2 = _interopRequireDefault(_removeCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    removeButtonHovered: {
        opacity: 1
    }
};

var FileInputPreview = exports.FileInputPreview = function (_Component) {
    (0, _inherits3.default)(FileInputPreview, _Component);

    function FileInputPreview(props) {
        (0, _classCallCheck3.default)(this, FileInputPreview);

        var _this = (0, _possibleConstructorReturn3.default)(this, (FileInputPreview.__proto__ || Object.getPrototypeOf(FileInputPreview)).call(this, props));

        _this.handleMouseOut = function () {
            return _this.setState({ hovered: false });
        };

        _this.handleMouseOver = function () {
            return _this.setState({ hovered: true });
        };

        _this.state = {
            hovered: false
        };
        return _this;
    }

    (0, _createClass3.default)(FileInputPreview, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var file = this.props.file;


            if (file.preview) {
                window.URL.revokeObjectURL(file.preview);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                onRemove = _props.onRemove,
                itemStyle = _props.itemStyle,
                removeStyle = _props.removeStyle;


            var removeButtonStyle = this.state.hovered ? (0, _extends3.default)({}, removeStyle, styles.removeButtonHovered) : removeStyle;

            return _react2.default.createElement(
                'div',
                {
                    onMouseOver: this.handleMouseOver,
                    onMouseOut: this.handleMouseOut,
                    style: itemStyle
                },
                _react2.default.createElement(
                    _IconButton2.default,
                    {
                        style: removeButtonStyle,
                        onClick: onRemove
                    },
                    _react2.default.createElement(_removeCircle2.default, { color: _colors.pinkA200 })
                ),
                children
            );
        }
    }]);
    return FileInputPreview;
}(_react.Component);

FileInputPreview.propTypes = {
    children: _propTypes2.default.element.isRequired,
    file: _propTypes2.default.object,
    onRemove: _propTypes2.default.func.isRequired,
    itemStyle: _propTypes2.default.object,
    removeStyle: _propTypes2.default.object
};

FileInputPreview.defaultProps = {
    file: undefined,
    itemStyle: {},
    removeStyle: { display: 'inline-block' }
};

exports.default = FileInputPreview;