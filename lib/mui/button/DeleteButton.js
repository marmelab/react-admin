'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _delete = require('material-ui/svg-icons/action/delete');

var _delete2 = _interopRequireDefault(_delete);

var _linkToRecord = require('../../util/linkToRecord');

var _linkToRecord2 = _interopRequireDefault(_linkToRecord);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteButton = function DeleteButton(_ref) {
    var _ref$basePath = _ref.basePath,
        basePath = _ref$basePath === undefined ? '' : _ref$basePath,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? 'aor.action.delete' : _ref$label,
        _ref$record = _ref.record,
        record = _ref$record === undefined ? {} : _ref$record,
        translate = _ref.translate;
    return _react2.default.createElement(_FlatButton2.default, {
        secondary: true,
        label: label && translate(label),
        icon: _react2.default.createElement(_delete2.default, null),
        containerElement: _react2.default.createElement(_reactRouterDom.Link, { to: (0, _linkToRecord2.default)(basePath, record.id) + '/delete' }),
        style: { overflow: 'inherit' }
    });
};

DeleteButton.propTypes = {
    basePath: _propTypes2.default.string,
    label: _propTypes2.default.string,
    record: _propTypes2.default.object,
    translate: _propTypes2.default.func.isRequired
};

exports.default = (0, _translate2.default)(DeleteButton);
module.exports = exports['default'];