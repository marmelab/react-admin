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

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _shallowEqual = require('recompose/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _FilterForm = require('./FilterForm');

var _FilterForm2 = _interopRequireDefault(_FilterForm);

var _FilterButton = require('./FilterButton');

var _FilterButton2 = _interopRequireDefault(_FilterButton);

var _defaultTheme = require('../defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filter = function (_Component) {
    (0, _inherits3.default)(Filter, _Component);

    function Filter(props) {
        (0, _classCallCheck3.default)(this, Filter);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

        _this.setFilters = (0, _lodash2.default)(function (filters) {
            if (!(0, _shallowEqual2.default)(filters, _this.filters)) {
                // fix for redux-form bug with onChange and enableReinitialize
                var filtersWithoutEmpty = filters;
                Object.keys(filtersWithoutEmpty).forEach(function (filterName) {
                    if (filtersWithoutEmpty[filterName] === '') {
                        // remove empty filter from query
                        delete filtersWithoutEmpty[filterName];
                    }
                });
                _this.props.setFilters(filtersWithoutEmpty);
                _this.filters = filtersWithoutEmpty;
            }
        }, _this.props.debounce);

        _this.filters = _this.props.filterValues;
        return _this;
    }

    (0, _createClass3.default)(Filter, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.filters = nextProps.filterValues;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.props.setFilters) {
                this.setFilters.cancel();
            }
        }
    }, {
        key: 'renderButton',
        value: function renderButton() {
            var _props = this.props,
                resource = _props.resource,
                children = _props.children,
                showFilter = _props.showFilter,
                displayedFilters = _props.displayedFilters,
                filterValues = _props.filterValues;

            return _react2.default.createElement(_FilterButton2.default, {
                resource: resource,
                filters: _react2.default.Children.toArray(children),
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues
            });
        }
    }, {
        key: 'renderForm',
        value: function renderForm() {
            var _props2 = this.props,
                resource = _props2.resource,
                children = _props2.children,
                hideFilter = _props2.hideFilter,
                displayedFilters = _props2.displayedFilters,
                filterValues = _props2.filterValues,
                theme = _props2.theme;

            return _react2.default.createElement(_FilterForm2.default, {
                resource: resource,
                filters: _react2.default.Children.toArray(children),
                hideFilter: hideFilter,
                displayedFilters: displayedFilters,
                initialValues: filterValues,
                setFilters: this.setFilters,
                theme: theme
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return this.props.context === 'button' ? this.renderButton() : this.renderForm();
        }
    }]);
    return Filter;
}(_react.Component);

Filter.propTypes = {
    children: _propTypes2.default.node,
    context: _propTypes2.default.oneOf(['form', 'button']),
    debounce: _propTypes2.default.number.isRequired,
    displayedFilters: _propTypes2.default.object,
    filterValues: _propTypes2.default.object,
    hideFilter: _propTypes2.default.func,
    setFilters: _propTypes2.default.func,
    showFilter: _propTypes2.default.func,
    resource: _propTypes2.default.string.isRequired,
    theme: _propTypes2.default.object
};

Filter.defaultProps = {
    debounce: 500,
    theme: _defaultTheme2.default
};

exports.default = Filter;
module.exports = exports['default'];