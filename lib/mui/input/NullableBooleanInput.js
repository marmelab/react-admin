'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NullableBooleanInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _SelectInput = require('./SelectInput');

var _SelectInput2 = _interopRequireDefault(_SelectInput);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NullableBooleanInput = exports.NullableBooleanInput = function NullableBooleanInput(_ref) {
    var input = _ref.input,
        meta = _ref.meta,
        label = _ref.label,
        source = _ref.source,
        elStyle = _ref.elStyle,
        resource = _ref.resource,
        translate = _ref.translate;
    return _react2.default.createElement(_SelectInput2.default, {
        input: input,
        label: label,
        source: source,
        resource: resource,
        choices: [{ id: null, name: '' }, { id: false, name: translate('aor.boolean.false') }, { id: true, name: translate('aor.boolean.true') }],
        meta: meta,
        style: elStyle
    });
};

NullableBooleanInput.propTypes = {
    addField: _propTypes2.default.bool.isRequired,
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    label: _propTypes2.default.string,
    meta: _propTypes2.default.object,
    resource: _propTypes2.default.string,
    source: _propTypes2.default.string
};

NullableBooleanInput.defaultProps = {
    addField: true
};

exports.default = (0, _translate2.default)(NullableBooleanInput);