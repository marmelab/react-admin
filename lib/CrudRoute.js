'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _Restricted = require('./auth/Restricted');

var _Restricted2 = _interopRequireDefault(_Restricted);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CrudRoute = function CrudRoute(_ref) {
    var resource = _ref.resource,
        list = _ref.list,
        create = _ref.create,
        edit = _ref.edit,
        show = _ref.show,
        remove = _ref.remove,
        options = _ref.options;

    var commonProps = {
        resource: resource,
        options: options,
        hasList: !!list,
        hasEdit: !!edit,
        hasShow: !!show,
        hasCreate: !!create,
        hasDelete: !!remove
    };
    var RestrictedPage = function RestrictedPage(component, route) {
        return function (routeProps) {
            return _react2.default.createElement(
                _Restricted2.default,
                (0, _extends3.default)({ authParams: { resource: resource, route: route } }, routeProps),
                (0, _react.createElement)(component, (0, _extends3.default)({}, commonProps, routeProps))
            );
        };
    };
    return _react2.default.createElement(
        _reactRouterDom.Switch,
        null,
        list && _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/' + resource, render: RestrictedPage(list, 'list') }),
        create && _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/' + resource + '/create', render: RestrictedPage(create, 'create') }),
        edit && _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/' + resource + '/:id', render: RestrictedPage(edit, 'edit') }),
        show && _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/' + resource + '/:id/show', render: RestrictedPage(show, 'show') }),
        remove && _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/' + resource + '/:id/delete', render: RestrictedPage(remove, 'delete') })
    );
};

exports.default = CrudRoute;
module.exports = exports['default'];