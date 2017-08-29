'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Toolbar = require('material-ui/Toolbar');

var _button = require('../button');

var _Responsive = require('../layout/Responsive');

var _Responsive2 = _interopRequireDefault(_Responsive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    mobileToolbar: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        zIndex: 2
    }
};

var valueOrDefault = function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
};

var Toolbar = function Toolbar(_ref) {
    var invalid = _ref.invalid,
        submitOnEnter = _ref.submitOnEnter,
        handleSubmitWithRedirect = _ref.handleSubmitWithRedirect,
        children = _ref.children;
    return _react2.default.createElement(_Responsive2.default, {
        small: _react2.default.createElement(
            _Toolbar.Toolbar,
            { style: styles.mobileToolbar, noGutter: true },
            _react2.default.createElement(
                _Toolbar.ToolbarGroup,
                null,
                _react.Children.count(children) === 0 ? _react2.default.createElement(_button.SaveButton, {
                    handleSubmitWithRedirect: handleSubmitWithRedirect,
                    invalid: invalid,
                    raised: false,
                    submitOnEnter: submitOnEnter
                }) : _react.Children.map(children, function (button) {
                    return _react2.default.cloneElement(button, {
                        invalid: invalid,
                        handleSubmitWithRedirect: handleSubmitWithRedirect,
                        raised: false,
                        submitOnEnter: valueOrDefault(button.props.submitOnEnter, submitOnEnter)
                    });
                })
            )
        ),
        medium: _react2.default.createElement(
            _Toolbar.Toolbar,
            null,
            _react2.default.createElement(
                _Toolbar.ToolbarGroup,
                null,
                _react.Children.count(children) === 0 ? _react2.default.createElement(_button.SaveButton, {
                    handleSubmitWithRedirect: handleSubmitWithRedirect,
                    invalid: invalid,
                    submitOnEnter: submitOnEnter
                }) : _react.Children.map(children, function (button) {
                    return _react2.default.cloneElement(button, {
                        handleSubmitWithRedirect: handleSubmitWithRedirect,
                        invalid: invalid,
                        submitOnEnter: valueOrDefault(button.props.submitOnEnter, submitOnEnter)
                    });
                })
            )
        )
    });
};

Toolbar.propTypes = {
    children: _propTypes2.default.node,
    handleSubmitWithRedirect: _propTypes2.default.func,
    invalid: _propTypes2.default.bool,
    submitOnEnter: _propTypes2.default.bool
};

Toolbar.defaultProps = {
    submitOnEnter: true
};

exports.default = Toolbar;
module.exports = exports['default'];