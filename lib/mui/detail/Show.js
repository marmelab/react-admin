'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Show = undefined;

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

var _ShowActions = require('./ShowActions');

var _ShowActions2 = _interopRequireDefault(_ShowActions);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Show = exports.Show = function (_Component) {
    (0, _inherits3.default)(Show, _Component);

    function Show() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Show);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Show.__proto__ || Object.getPrototypeOf(Show)).call.apply(_ref, [this].concat(args))), _this), _this.refresh = function (event) {
            event.stopPropagation();
            _this.fullRefresh = true;
            _this.updateData();
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Show, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateData();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.id !== nextProps.id) {
                this.updateData(nextProps.resource, nextProps.id);
            }
        }
    }, {
        key: 'getBasePath',
        value: function getBasePath() {
            var location = this.props.location;

            return location.pathname.split('/').slice(0, -2).join('/');
        }
    }, {
        key: 'updateData',
        value: function updateData() {
            var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.resource;
            var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.id;

            this.props.crudGetOne(resource, id, this.getBasePath());
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                _props$actions = _props.actions,
                actions = _props$actions === undefined ? _react2.default.createElement(_ShowActions2.default, null) : _props$actions,
                title = _props.title,
                children = _props.children,
                id = _props.id,
                data = _props.data,
                isLoading = _props.isLoading,
                resource = _props.resource,
                hasDelete = _props.hasDelete,
                hasEdit = _props.hasEdit,
                translate = _props.translate;

            var basePath = this.getBasePath();

            var resourceName = translate('resources.' + resource + '.name', {
                smart_count: 1,
                _: _inflection2.default.humanize(_inflection2.default.singularize(resource))
            });
            var defaultTitle = translate('aor.page.show', {
                name: '' + resourceName,
                id: id,
                data: data
            });
            var titleElement = data ? _react2.default.createElement(_Title2.default, { title: title, record: data, defaultTitle: defaultTitle }) : '';

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Card.Card,
                    { style: { opacity: isLoading ? 0.8 : 1 } },
                    actions && _react2.default.cloneElement(actions, {
                        basePath: basePath,
                        data: data,
                        hasDelete: hasDelete,
                        hasEdit: hasEdit,
                        refresh: this.refresh,
                        resource: resource
                    }),
                    _react2.default.createElement(_ViewTitle2.default, { title: titleElement }),
                    data && _react2.default.cloneElement(children, {
                        resource: resource,
                        basePath: basePath,
                        record: data,
                        translate: translate
                    })
                )
            );
        }
    }]);
    return Show;
}(_react.Component);

Show.propTypes = {
    actions: _propTypes2.default.element,
    children: _propTypes2.default.element,
    crudGetOne: _propTypes2.default.func.isRequired,
    data: _propTypes2.default.object,
    hasDelete: _propTypes2.default.bool,
    hasEdit: _propTypes2.default.bool,
    id: _propTypes2.default.string.isRequired,
    isLoading: _propTypes2.default.bool.isRequired,
    location: _propTypes2.default.object.isRequired,
    match: _propTypes2.default.object.isRequired,
    resource: _propTypes2.default.string.isRequired,
    title: _propTypes2.default.any,
    translate: _propTypes2.default.func
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data: state.admin[props.resource].data[decodeURIComponent(props.match.params.id)],
        isLoading: state.admin.loading > 0
    };
}

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(mapStateToProps, { crudGetOne: _dataActions.crudGetOne }), _translate2.default);

exports.default = enhance(Show);