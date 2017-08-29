'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabbedShowLayout = undefined;

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

var _reactRedux = require('react-redux');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _Tabs = require('material-ui/Tabs');

var _getDefaultValues = require('../form/getDefaultValues');

var _getDefaultValues2 = _interopRequireDefault(_getDefaultValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var divStyle = { padding: '0 1em 1em 1em' };

var TabbedShowLayout = exports.TabbedShowLayout = function (_Component) {
    (0, _inherits3.default)(TabbedShowLayout, _Component);

    function TabbedShowLayout(props) {
        (0, _classCallCheck3.default)(this, TabbedShowLayout);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TabbedShowLayout.__proto__ || Object.getPrototypeOf(TabbedShowLayout)).call(this, props));

        _this.handleChange = function (value) {
            _this.setState({ value: value });
        };

        _this.state = {
            value: 0
        };
        return _this;
    }

    (0, _createClass3.default)(TabbedShowLayout, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                contentContainerStyle = _props.contentContainerStyle,
                record = _props.record,
                resource = _props.resource,
                basePath = _props.basePath,
                translate = _props.translate;

            return _react2.default.createElement(
                'div',
                { style: divStyle },
                _react2.default.createElement(
                    _Tabs.Tabs,
                    { value: this.state.value, onChange: this.handleChange, contentContainerStyle: contentContainerStyle },
                    _react2.default.Children.map(children, function (tab, index) {
                        return _react2.default.createElement(
                            _Tabs.Tab,
                            { key: tab.props.value, label: translate(tab.props.label, { _: tab.props.label }), value: index, icon: tab.props.icon },
                            _react2.default.cloneElement(tab, { resource: resource, record: record, basePath: basePath })
                        );
                    })
                )
            );
        }
    }]);
    return TabbedShowLayout;
}(_react.Component);

TabbedShowLayout.propTypes = {
    children: _propTypes2.default.node,
    contentContainerStyle: _propTypes2.default.object,
    record: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    basePath: _propTypes2.default.string,
    translate: _propTypes2.default.func
};

TabbedShowLayout.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' }
};

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(function (state, props) {
    return {
        initialValues: (0, _getDefaultValues2.default)(state, props)
    };
}));

exports.default = enhance(TabbedShowLayout);