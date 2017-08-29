'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterButton = undefined;

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

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _Popover = require('material-ui/Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _Menu = require('material-ui/Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _filterList = require('material-ui/svg-icons/content/filter-list');

var _filterList2 = _interopRequireDefault(_filterList);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

var _FilterButtonMenuItem = require('./FilterButtonMenuItem');

var _FilterButtonMenuItem2 = _interopRequireDefault(_FilterButtonMenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FilterButton = exports.FilterButton = function (_Component) {
    (0, _inherits3.default)(FilterButton, _Component);

    function FilterButton(props) {
        (0, _classCallCheck3.default)(this, FilterButton);

        var _this = (0, _possibleConstructorReturn3.default)(this, (FilterButton.__proto__ || Object.getPrototypeOf(FilterButton)).call(this, props));

        _this.handleShow = _this.handleShow.bind(_this);
        _this.state = {
            open: false
        };
        _this.handleTouchTap = _this.handleTouchTap.bind(_this);
        _this.handleRequestClose = _this.handleRequestClose.bind(_this);
        _this.handleShow = _this.handleShow.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(FilterButton, [{
        key: 'getHiddenFilters',
        value: function getHiddenFilters() {
            var _props = this.props,
                filters = _props.filters,
                displayedFilters = _props.displayedFilters,
                filterValues = _props.filterValues;

            return filters.filter(function (filterElement) {
                return !filterElement.props.alwaysOn && !displayedFilters[filterElement.props.source] && !filterValues[filterElement.props.source];
            });
        }
    }, {
        key: 'handleTouchTap',
        value: function handleTouchTap(event) {
            // This prevents ghost click.
            event.preventDefault();

            this.setState({
                open: true,
                anchorEl: event.currentTarget
            });
        }
    }, {
        key: 'handleRequestClose',
        value: function handleRequestClose() {
            this.setState({
                open: false
            });
        }
    }, {
        key: 'handleShow',
        value: function handleShow(_ref) {
            var source = _ref.source,
                defaultValue = _ref.defaultValue;

            this.props.showFilter(source, defaultValue);
            this.setState({
                open: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var hiddenFilters = this.getHiddenFilters();
            var resource = this.props.resource;
            var _state = this.state,
                open = _state.open,
                anchorEl = _state.anchorEl;


            return hiddenFilters.length > 0 && _react2.default.createElement(
                'div',
                { style: { display: 'inline-block' } },
                _react2.default.createElement(_FlatButton2.default, {
                    className: 'add-filter',
                    primary: true,
                    label: this.props.translate('aor.action.add_filter'),
                    icon: _react2.default.createElement(_filterList2.default, null),
                    onTouchTap: this.handleTouchTap
                }),
                _react2.default.createElement(
                    _Popover2.default,
                    {
                        open: open,
                        anchorEl: anchorEl,
                        anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
                        targetOrigin: { horizontal: 'left', vertical: 'top' },
                        onRequestClose: this.handleRequestClose
                    },
                    _react2.default.createElement(
                        _Menu2.default,
                        null,
                        hiddenFilters.map(function (filterElement) {
                            return _react2.default.createElement(_FilterButtonMenuItem2.default, {
                                key: filterElement.props.source,
                                filter: filterElement.props,
                                resource: resource,
                                onShow: _this2.handleShow
                            });
                        })
                    )
                )
            );
        }
    }]);
    return FilterButton;
}(_react.Component);

FilterButton.propTypes = {
    resource: _propTypes2.default.string.isRequired,
    filters: _propTypes2.default.arrayOf(_propTypes2.default.node).isRequired,
    displayedFilters: _propTypes2.default.object.isRequired,
    filterValues: _propTypes2.default.object.isRequired,
    showFilter: _propTypes2.default.func.isRequired,
    translate: _propTypes2.default.func.isRequired
};

exports.default = (0, _translate2.default)(FilterButton);