'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pagination = undefined;

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

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _chevronLeft = require('material-ui/svg-icons/navigation/chevron-left');

var _chevronLeft2 = _interopRequireDefault(_chevronLeft);

var _chevronRight = require('material-ui/svg-icons/navigation/chevron-right');

var _chevronRight2 = _interopRequireDefault(_chevronRight);

var _Toolbar = require('material-ui/Toolbar');

var _colors = require('material-ui/styles/colors');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _withWidth = require('material-ui/utils/withWidth');

var _withWidth2 = _interopRequireDefault(_withWidth);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    button: {
        margin: '10px 0'
    },
    pageInfo: {
        padding: '1.2em'
    },
    mobileToolbar: {
        margin: 'auto'
    }
};

var Pagination = exports.Pagination = function (_Component) {
    (0, _inherits3.default)(Pagination, _Component);

    function Pagination() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Pagination);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call.apply(_ref, [this].concat(args))), _this), _this.prevPage = function (event) {
            event.stopPropagation();
            if (_this.props.page === 1) {
                throw new Error(_this.props.translate('aor.navigation.page_out_from_begin'));
            }
            _this.props.setPage(_this.props.page - 1);
        }, _this.nextPage = function (event) {
            event.stopPropagation();
            if (_this.props.page > _this.getNbPages()) {
                throw new Error(_this.props.translate('aor.navigation.page_out_from_end'));
            }
            _this.props.setPage(_this.props.page + 1);
        }, _this.gotoPage = function (event) {
            event.stopPropagation();
            var page = event.currentTarget.dataset.page;
            if (page < 1 || page > _this.getNbPages()) {
                throw new Error(_this.props.translate('aor.navigation.page_out_of_boundaries', { page: page }));
            }
            _this.props.setPage(page);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Pagination, [{
        key: 'range',
        value: function range() {
            var input = [];
            var _props = this.props,
                page = _props.page,
                perPage = _props.perPage,
                total = _props.total;

            if (isNaN(page)) return input;
            var nbPages = Math.ceil(total / perPage) || 1;

            // display page links around the current page
            if (page > 2) {
                input.push('1');
            }
            if (page === 4) {
                input.push('2');
            }
            if (page > 4) {
                input.push('.');
            }
            if (page > 1) {
                input.push(page - 1);
            }
            input.push(page);
            if (page < nbPages) {
                input.push(page + 1);
            }
            if (page === nbPages - 3) {
                input.push(nbPages - 1);
            }
            if (page < nbPages - 3) {
                input.push('.');
            }
            if (page < nbPages - 1) {
                input.push(nbPages);
            }

            return input;
        }
    }, {
        key: 'getNbPages',
        value: function getNbPages() {
            return Math.ceil(this.props.total / this.props.perPage) || 1;
        }
    }, {
        key: 'renderPageNums',
        value: function renderPageNums() {
            var _this2 = this;

            return this.range().map(function (pageNum, index) {
                return pageNum === '.' ? _react2.default.createElement(
                    'span',
                    { key: 'hyphen_' + index, style: { padding: '1.2em' } },
                    '\u2026'
                ) : _react2.default.createElement(_FlatButton2.default, { className: 'page-number', key: pageNum, label: pageNum, 'data-page': pageNum, onClick: _this2.gotoPage, primary: pageNum !== _this2.props.page, style: styles.button });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                page = _props2.page,
                perPage = _props2.perPage,
                total = _props2.total,
                translate = _props2.translate,
                width = _props2.width;

            if (total === 0) return null;
            var offsetEnd = Math.min(page * perPage, total);
            var offsetBegin = Math.min((page - 1) * perPage + 1, offsetEnd);
            var nbPages = this.getNbPages();

            return width === 1 ? _react2.default.createElement(
                _Toolbar.Toolbar,
                null,
                _react2.default.createElement(
                    _Toolbar.ToolbarGroup,
                    { style: styles.mobileToolbar },
                    page > 1 && _react2.default.createElement(
                        _IconButton2.default,
                        { onClick: this.prevPage },
                        _react2.default.createElement(_chevronLeft2.default, { color: _colors.cyan500 })
                    ),
                    _react2.default.createElement(
                        'span',
                        { style: styles.pageInfo },
                        translate('aor.navigation.page_range_info', { offsetBegin: offsetBegin, offsetEnd: offsetEnd, total: total })
                    ),
                    page !== nbPages && _react2.default.createElement(
                        _IconButton2.default,
                        { onClick: this.nextPage },
                        _react2.default.createElement(_chevronRight2.default, { color: _colors.cyan500 })
                    )
                )
            ) : _react2.default.createElement(
                _Toolbar.Toolbar,
                null,
                _react2.default.createElement(
                    _Toolbar.ToolbarGroup,
                    { firstChild: true },
                    _react2.default.createElement(
                        'span',
                        { className: 'displayed-records', style: styles.pageInfo },
                        translate('aor.navigation.page_range_info', { offsetBegin: offsetBegin, offsetEnd: offsetEnd, total: total })
                    )
                ),
                nbPages > 1 && _react2.default.createElement(
                    _Toolbar.ToolbarGroup,
                    null,
                    page > 1 && _react2.default.createElement(_FlatButton2.default, { className: 'previous-page', primary: true, key: 'prev', label: translate('aor.navigation.prev'), icon: _react2.default.createElement(_chevronLeft2.default, null), onClick: this.prevPage, style: styles.button }),
                    this.renderPageNums(),
                    page !== nbPages && _react2.default.createElement(_FlatButton2.default, { className: 'next-page', primary: true, key: 'next', label: translate('aor.navigation.next'), icon: _react2.default.createElement(_chevronRight2.default, null), labelPosition: 'before', onClick: this.nextPage, style: styles.button })
                )
            );
        }
    }]);
    return Pagination;
}(_react.Component);

Pagination.propTypes = {
    page: _propTypes2.default.number,
    perPage: _propTypes2.default.number,
    total: _propTypes2.default.number,
    setPage: _propTypes2.default.func,
    translate: _propTypes2.default.func.isRequired,
    width: _propTypes2.default.number
};

var enhance = (0, _compose2.default)(_pure2.default, _translate2.default, (0, _withWidth2.default)());

exports.default = enhance(Pagination);