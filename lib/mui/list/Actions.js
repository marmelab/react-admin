'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Card = require('material-ui/Card');

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _autoprefixer = require('material-ui/utils/autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _button = require('../button');

var _onlyUpdateForKeys = require('recompose/onlyUpdateForKeys');

var _onlyUpdateForKeys2 = _interopRequireDefault(_onlyUpdateForKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardActionStyle = {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
};

var Actions = function Actions(_ref) {
    var resource = _ref.resource,
        filters = _ref.filters,
        displayedFilters = _ref.displayedFilters,
        filterValues = _ref.filterValues,
        theme = _ref.theme,
        hasCreate = _ref.hasCreate,
        basePath = _ref.basePath,
        showFilter = _ref.showFilter,
        refresh = _ref.refresh;

    var muiTheme = (0, _getMuiTheme2.default)(theme);
    var prefix = (0, _autoprefixer2.default)(muiTheme);

    return _react2.default.createElement(
        _Card.CardActions,
        { style: prefix(cardActionStyle) },
        filters && _react2.default.cloneElement(filters, { resource: resource, showFilter: showFilter, displayedFilters: displayedFilters, filterValues: filterValues, context: 'button' }),
        hasCreate && _react2.default.createElement(_button.CreateButton, { basePath: basePath }),
        _react2.default.createElement(_button.RefreshButton, { refresh: refresh })
    );
};

exports.default = (0, _onlyUpdateForKeys2.default)(['resource', 'filters', 'displayedFilters', 'filterValues', 'theme'])(Actions);
module.exports = exports['default'];