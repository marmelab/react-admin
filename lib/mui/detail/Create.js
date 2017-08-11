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

var _reactRedux = require('react-redux');

var _Card = require('material-ui/Card');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _ViewTitle = require('../layout/ViewTitle');

var _ViewTitle2 = _interopRequireDefault(_ViewTitle);

var _Title = require('../layout/Title');

var _Title2 = _interopRequireDefault(_Title);

var _dataActions = require('../../actions/dataActions');

var _CreateActions = require('./CreateActions');

var _CreateActions2 = _interopRequireDefault(_CreateActions);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Create = function (_Component) {
    (0, _inherits3.default)(Create, _Component);

    function Create() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Create);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Create.__proto__ || Object.getPrototypeOf(Create)).call.apply(_ref, [this].concat(args))), _this), _this.save = function (record, redirect) {
            _this.props.crudCreate(_this.props.resource, record, _this.getBasePath(), redirect);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Create, [{
        key: 'getBasePath',
        value: function getBasePath() {
            var location = this.props.location;

            return location.pathname.split('/').slice(0, -1).join('/');
        }
    }, {
        key: 'defaultRedirectRoute',
        value: function defaultRedirectRoute() {
            var _props = this.props,
                hasShow = _props.hasShow,
                hasEdit = _props.hasEdit;

            if (hasEdit) return 'edit';
            if (hasShow) return 'show';
            return 'list';
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                _props2$actions = _props2.actions,
                actions = _props2$actions === undefined ? _react2.default.createElement(_CreateActions2.default, null) : _props2$actions,
                children = _props2.children,
                isLoading = _props2.isLoading,
                resource = _props2.resource,
                title = _props2.title,
                translate = _props2.translate;

            var basePath = this.getBasePath();

            var resourceName = translate('resources.' + resource + '.name', {
                smart_count: 1,
                _: _inflection2.default.humanize(_inflection2.default.singularize(resource))
            });
            var defaultTitle = translate('aor.page.create', {
                name: '' + resourceName
            });
            var titleElement = _react2.default.createElement(_Title2.default, { title: title, defaultTitle: defaultTitle });

            return _react2.default.createElement(
                'div',
                { className: 'create-page' },
                _react2.default.createElement(
                    _Card.Card,
                    { style: { opacity: isLoading ? 0.8 : 1 } },
                    actions && _react2.default.cloneElement(actions, {
                        basePath: basePath,
                        resource: resource
                    }),
                    _react2.default.createElement(_ViewTitle2.default, { title: titleElement }),
                    _react2.default.cloneElement(children, {
                        save: this.save,
                        resource: resource,
                        basePath: basePath,
                        record: {},
                        translate: translate,
                        redirect: typeof children.props.redirect === 'undefined' ? this.defaultRedirectRoute() : children.props.redirect
                    })
                )
            );
        }
    }]);
    return Create;
}(_react.Component);

Create.propTypes = {
    actions: _propTypes2.default.element,
    children: _propTypes2.default.element,
    crudCreate: _propTypes2.default.func.isRequired,
    isLoading: _propTypes2.default.bool.isRequired,
    location: _propTypes2.default.object.isRequired,
    resource: _propTypes2.default.string.isRequired,
    title: _propTypes2.default.any,
    translate: _propTypes2.default.func.isRequired
};

Create.defaultProps = {
    data: {}
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0
    };
}

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(mapStateToProps, { crudCreate: _dataActions.crudCreate }), _translate2.default);

exports.default = enhance(Create);
module.exports = exports['default'];