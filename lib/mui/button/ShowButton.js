'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _shouldUpdate = require('recompose/shouldUpdate');

var _shouldUpdate2 = _interopRequireDefault(_shouldUpdate);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _removeRedEye = require('material-ui/svg-icons/image/remove-red-eye');

var _removeRedEye2 = _interopRequireDefault(_removeRedEye);

var _linkToRecord = require('../../util/linkToRecord');

var _linkToRecord2 = _interopRequireDefault(_linkToRecord);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShowButton = function ShowButton(_ref) {
    var _ref$basePath = _ref.basePath,
        basePath = _ref$basePath === undefined ? '' : _ref$basePath,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? 'aor.action.show' : _ref$label,
        _ref$record = _ref.record,
        record = _ref$record === undefined ? {} : _ref$record,
        translate = _ref.translate;
    return _react2.default.createElement(_FlatButton2.default, {
        primary: true,
        label: label && translate(label),
        icon: _react2.default.createElement(_removeRedEye2.default, null),
        containerElement: _react2.default.createElement(_reactRouterDom.Link, { to: (0, _linkToRecord2.default)(basePath, record.id) + '/show' }),
        style: { overflow: 'inherit' }
    });
};

ShowButton.propTypes = {
    basePath: _propTypes2.default.string,
    label: _propTypes2.default.string,
    record: _propTypes2.default.object,
    translate: _propTypes2.default.func.isRequired
};

var enhance = (0, _compose2.default)((0, _shouldUpdate2.default)(function (props, nextProps) {
    return props.record && props.record.id !== nextProps.record.id || props.basePath !== nextProps.basePath || props.record == null && nextProps.record != null;
}), _translate2.default);

exports.default = enhance(ShowButton);
module.exports = exports['default'];