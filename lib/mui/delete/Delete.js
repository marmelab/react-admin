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

var _Toolbar = require('material-ui/Toolbar');

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _checkCircle = require('material-ui/svg-icons/action/check-circle');

var _checkCircle2 = _interopRequireDefault(_checkCircle);

var _errorOutline = require('material-ui/svg-icons/alert/error-outline');

var _errorOutline2 = _interopRequireDefault(_errorOutline);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _ViewTitle = require('../layout/ViewTitle');

var _ViewTitle2 = _interopRequireDefault(_ViewTitle);

var _Title = require('../layout/Title');

var _Title2 = _interopRequireDefault(_Title);

var _button = require('../button');

var _dataActions = require('../../actions/dataActions');

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    actions: { zIndex: 2, display: 'inline-block', float: 'right' },
    toolbar: { clear: 'both' },
    button: { margin: '10px 24px', position: 'relative' }
};

var Delete = function (_Component) {
    (0, _inherits3.default)(Delete, _Component);

    function Delete(props) {
        (0, _classCallCheck3.default)(this, Delete);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Delete.__proto__ || Object.getPrototypeOf(Delete)).call(this, props));

        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.goBack = _this.goBack.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Delete, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.crudGetOne(this.props.resource, this.props.id, this.getBasePath());
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.id !== nextProps.id) {
                this.props.crudGetOne(nextProps.resource, nextProps.id, this.getBasePath());
            }
        }
    }, {
        key: 'getBasePath',
        value: function getBasePath() {
            var location = this.props.location;

            return location.pathname.split('/').slice(0, -2).join('/');
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            event.preventDefault();
            this.props.crudDelete(this.props.resource, this.props.id, this.getBasePath());
        }
    }, {
        key: 'goBack',
        value: function goBack() {
            this.props.history.goBack();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                title = _props.title,
                id = _props.id,
                data = _props.data,
                isLoading = _props.isLoading,
                resource = _props.resource,
                translate = _props.translate;

            var basePath = this.getBasePath();

            var resourceName = translate('resources.' + resource + '.name', {
                smart_count: 1,
                _: _inflection2.default.humanize(_inflection2.default.singularize(resource))
            });
            var defaultTitle = translate('aor.page.delete', {
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
                    { style: { opacity: isLoading ? .8 : 1 } },
                    _react2.default.createElement(
                        _Card.CardActions,
                        { style: styles.actions },
                        _react2.default.createElement(_button.ListButton, { basePath: basePath })
                    ),
                    _react2.default.createElement(_ViewTitle2.default, { title: titleElement }),
                    _react2.default.createElement(
                        'form',
                        { onSubmit: this.handleSubmit },
                        _react2.default.createElement(
                            _Card.CardText,
                            null,
                            translate('aor.message.are_you_sure')
                        ),
                        _react2.default.createElement(
                            _Toolbar.Toolbar,
                            { style: styles.toolbar },
                            _react2.default.createElement(
                                _Toolbar.ToolbarGroup,
                                null,
                                _react2.default.createElement(_RaisedButton2.default, {
                                    type: 'submit',
                                    label: translate('aor.action.delete'),
                                    icon: _react2.default.createElement(_checkCircle2.default, null),
                                    primary: true,
                                    style: styles.button
                                }),
                                _react2.default.createElement(_RaisedButton2.default, {
                                    label: translate('aor.action.cancel'),
                                    icon: _react2.default.createElement(_errorOutline2.default, null),
                                    onClick: this.goBack,
                                    style: styles.button
                                })
                            )
                        )
                    )
                )
            );
        }
    }]);
    return Delete;
}(_react.Component);

Delete.propTypes = {
    title: _propTypes2.default.any,
    id: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string.isRequired,
    location: _propTypes2.default.object.isRequired,
    match: _propTypes2.default.object.isRequired,
    history: _propTypes2.default.object.isRequired,
    data: _propTypes2.default.object,
    isLoading: _propTypes2.default.bool.isRequired,
    crudGetOne: _propTypes2.default.func.isRequired,
    crudDelete: _propTypes2.default.func.isRequired,
    translate: _propTypes2.default.func.isRequired
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data: state.admin[props.resource].data[decodeURIComponent(props.match.params.id)],
        isLoading: state.admin.loading > 0
    };
}

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(mapStateToProps, { crudGetOne: _dataActions.crudGetOne, crudDelete: _dataActions.crudDelete }), _translate2.default);

exports.default = enhance(Delete);
module.exports = exports['default'];