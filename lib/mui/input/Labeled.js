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

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _FieldTitle = require('../../util/FieldTitle');

var _FieldTitle2 = _interopRequireDefault(_FieldTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultLabelStyle = {
    paddingTop: '2em',
    height: 'auto'
};

/**
 * Use any component as read-only Input, labeled just like other Inputs.
 *
 * Useful to use a Field in the Edit or Create components.
 * The child component will receive the current record.
 *
 * This component name doesn't have a typo. We had to choose between
 * the American English "Labeled", and the British English "Labelled".
 * We flipped a coin.
 *
 * @example
 * <Labeled label="Comments">
 *     <FooComponent source="title" />
 * </Labeled>
 */

var Labeled = function (_Component) {
    (0, _inherits3.default)(Labeled, _Component);

    function Labeled() {
        (0, _classCallCheck3.default)(this, Labeled);
        return (0, _possibleConstructorReturn3.default)(this, (Labeled.__proto__ || Object.getPrototypeOf(Labeled)).apply(this, arguments));
    }

    (0, _createClass3.default)(Labeled, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                input = _props.input,
                isRequired = _props.isRequired,
                label = _props.label,
                resource = _props.resource,
                record = _props.record,
                onChange = _props.onChange,
                basePath = _props.basePath,
                children = _props.children,
                source = _props.source,
                _props$disabled = _props.disabled,
                disabled = _props$disabled === undefined ? true : _props$disabled,
                _props$labelStyle = _props.labelStyle,
                labelStyle = _props$labelStyle === undefined ? defaultLabelStyle : _props$labelStyle;

            if (!label && !source) {
                throw new Error('Cannot create label for component <' + (children && children.type && children.type.name) + '>: You must set either the label or source props. You can also disable automated label insertion by setting \'addLabel: false\' in the component default props');
            }
            return _react2.default.createElement(
                _TextField2.default,
                {
                    floatingLabelText: _react2.default.createElement(_FieldTitle2.default, { label: label, source: source, resource: resource, isRequired: isRequired }),
                    floatingLabelFixed: true,
                    fullWidth: true,
                    disabled: disabled,
                    underlineShow: false,
                    style: labelStyle
                },
                children && typeof children.type !== 'string' ? _react2.default.cloneElement(children, { input: input, record: record, resource: resource, onChange: onChange, basePath: basePath }) : children
            );
        }
    }]);
    return Labeled;
}(_react.Component);

Labeled.propTypes = {
    basePath: _propTypes2.default.string,
    children: _propTypes2.default.element,
    disabled: _propTypes2.default.bool,
    input: _propTypes2.default.object,
    isRequired: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    record: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string,
    labelStyle: _propTypes2.default.object
};

exports.default = Labeled;
module.exports = exports['default'];