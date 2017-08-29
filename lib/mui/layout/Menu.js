'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _DashboardMenuItem = require('./DashboardMenuItem');

var _DashboardMenuItem2 = _interopRequireDefault(_DashboardMenuItem);

var _MenuItemLink = require('./MenuItemLink');

var _MenuItemLink2 = _interopRequireDefault(_MenuItemLink);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%'
    }
};

var translatedResourceName = function translatedResourceName(resource, translate) {
    return translate('resources.' + resource.name + '.name', {
        smart_count: 2,
        _: resource.options && resource.options.label ? translate(resource.options.label, { smart_count: 2, _: resource.options.label }) : _inflection2.default.humanize(_inflection2.default.pluralize(resource.name))
    });
};

var Menu = function Menu(_ref) {
    var hasDashboard = _ref.hasDashboard,
        onMenuTap = _ref.onMenuTap,
        resources = _ref.resources,
        translate = _ref.translate,
        logout = _ref.logout;
    return _react2.default.createElement(
        'div',
        { style: styles.main },
        hasDashboard && _react2.default.createElement(_DashboardMenuItem2.default, { onTouchTap: onMenuTap }),
        resources.filter(function (r) {
            return r.list;
        }).map(function (resource) {
            return _react2.default.createElement(_MenuItemLink2.default, {
                key: resource.name,
                to: '/' + resource.name,
                primaryText: translatedResourceName(resource, translate),
                leftIcon: _react2.default.createElement(resource.icon, null),
                onTouchTap: onMenuTap
            });
        }),
        logout
    );
};

Menu.propTypes = {
    hasDashboard: _propTypes2.default.bool,
    logout: _propTypes2.default.element,
    onMenuTap: _propTypes2.default.func,
    resources: _propTypes2.default.array.isRequired,
    translate: _propTypes2.default.func.isRequired
};

Menu.defaultProps = {
    onMenuTap: function onMenuTap() {
        return null;
    }
};

var enhance = (0, _compose2.default)(_pure2.default, _translate2.default);

exports.default = enhance(Menu);
module.exports = exports['default'];