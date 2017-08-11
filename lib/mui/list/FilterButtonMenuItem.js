'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FilterButtonMenuItem = function (_Component) {
    (0, _inherits3.default)(FilterButtonMenuItem, _Component);

    function FilterButtonMenuItem() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, FilterButtonMenuItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FilterButtonMenuItem.__proto__ || Object.getPrototypeOf(FilterButtonMenuItem)).call.apply(_ref, [this].concat(args))), _this), _this.handleShow = function () {
            var _this$props = _this.props,
                filter = _this$props.filter,
                onShow = _this$props.onShow;

            onShow({ source: filter.source, defaultValue: filter.defaultValue });
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(FilterButtonMenuItem, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                filter = _props.filter,
                resource = _props.resource;


            return _react2.default.createElement(_MenuItem2.default, {
                className: 'new-filter-item',
                'data-key': filter.source,
                'data-default-value': filter.defaultValue,
                key: filter.source,
                primaryText: _react2.default.createElement(_FieldTitle2.default, { label: filter.label, source: filter.source, resource: resource }),
                onTouchTap: this.handleShow
            });
        }
    }]);
    return FilterButtonMenuItem;
}(_react.Component);

FilterButtonMenuItem.propTypes = {
    filter: _propTypes2.default.object.isRequired,
    onShow: _propTypes2.default.func.isRequired,
    resource: _propTypes2.default.string.isRequired
};
exports.default = FilterButtonMenuItem;
module.exports = exports['default'];