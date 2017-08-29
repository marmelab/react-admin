'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.List = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _queryString = require('query-string');

var _reactRouterRedux = require('react-router-redux');

var _Card = require('material-ui/Card');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _reselect = require('reselect');

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _autoprefixer = require('material-ui/utils/autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _queryReducer = require('../../reducer/resource/list/queryReducer');

var _queryReducer2 = _interopRequireDefault(_queryReducer);

var _ViewTitle = require('../layout/ViewTitle');

var _ViewTitle2 = _interopRequireDefault(_ViewTitle);

var _Title = require('../layout/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _dataActions = require('../../actions/dataActions');

var _listActions = require('../../actions/listActions');

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

var _removeKey = require('../../util/removeKey');

var _removeKey2 = _interopRequireDefault(_removeKey);

var _defaultTheme = require('../defaultTheme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    noResults: { padding: 20 },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <List> is a connected component, and <Datagrid> is a dumb component.
 *
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <List {...props}
 *             title="List of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </List>
 *     );
 */

var List = exports.List = function (_Component) {
    (0, _inherits3.default)(List, _Component);

    function List(props) {
        (0, _classCallCheck3.default)(this, List);

        var _this = (0, _possibleConstructorReturn3.default)(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this.refresh = function (event) {
            event.stopPropagation();
            _this.fullRefresh = true;
            _this.updateData();
        };

        _this.setSort = function (sort) {
            return _this.changeParams({ type: _queryReducer.SET_SORT, payload: sort });
        };

        _this.setPage = function (page) {
            return _this.changeParams({ type: _queryReducer.SET_PAGE, payload: page });
        };

        _this.setFilters = function (filters) {
            return _this.changeParams({ type: _queryReducer.SET_FILTER, payload: filters });
        };

        _this.showFilter = function (filterName, defaultValue) {
            _this.setState((0, _defineProperty3.default)({}, filterName, true));
            if (typeof defaultValue !== 'undefined') {
                _this.setFilters((0, _extends4.default)({}, _this.props.filterValues, (0, _defineProperty3.default)({}, filterName, defaultValue)));
            }
        };

        _this.hideFilter = function (filterName) {
            _this.setState((0, _defineProperty3.default)({}, filterName, false));
            var newFilters = (0, _removeKey2.default)(_this.props.filterValues, filterName);
            _this.setFilters(newFilters);
        };

        _this.state = { key: 0 };
        return _this;
    }

    (0, _createClass3.default)(List, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateData();
            if (Object.keys(this.props.query).length > 0) {
                this.props.changeListParams(this.props.resource, this.props.query);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.resource !== this.props.resource || nextProps.query.sort !== this.props.query.sort || nextProps.query.order !== this.props.query.order || nextProps.query.page !== this.props.query.page || nextProps.query.filter !== this.props.query.filter) {
                this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
            }
            if (nextProps.data !== this.props.data && this.fullRefresh) {
                this.fullRefresh = false;
                this.setState({ key: this.state.key + 1 });
            }
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.isLoading === this.props.isLoading && nextProps.width === this.props.width && nextState === this.state) {
                return false;
            }
            return true;
        }
    }, {
        key: 'getBasePath',
        value: function getBasePath() {
            return this.props.location.pathname;
        }
    }, {
        key: 'getQuery',


        /**
         * Merge list params from 3 different sources:
         *   - the query string
         *   - the params stored in the state (from previous navigation)
         *   - the props passed to the List component
         */
        value: function getQuery() {
            var query = Object.keys(this.props.query).length > 0 ? this.props.query : (0, _extends4.default)({}, this.props.params);
            if (!query.sort) {
                query.sort = this.props.sort.field;
                query.order = this.props.sort.order;
            }
            if (!query.perPage) {
                query.perPage = this.props.perPage;
            }
            return query;
        }
    }, {
        key: 'updateData',
        value: function updateData(query) {
            var params = query || this.getQuery();
            var sort = params.sort,
                order = params.order,
                page = params.page,
                perPage = params.perPage,
                filter = params.filter;

            var pagination = { page: parseInt(page, 10), perPage: parseInt(perPage, 10) };
            var permanentFilter = this.props.filter;
            this.props.crudGetList(this.props.resource, pagination, { field: sort, order: order }, (0, _extends4.default)({}, filter, permanentFilter));
        }
    }, {
        key: 'changeParams',
        value: function changeParams(action) {
            var newParams = (0, _queryReducer2.default)(this.getQuery(), action);
            this.props.push((0, _extends4.default)({}, this.props.location, { search: '?' + (0, _queryString.stringify)((0, _extends4.default)({}, newParams, { filter: JSON.stringify(newParams.filter) })) }));
            this.props.changeListParams(this.props.resource, newParams);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                filters = _props.filters,
                _props$pagination = _props.pagination,
                pagination = _props$pagination === undefined ? _react2.default.createElement(_Pagination2.default, null) : _props$pagination,
                _props$actions = _props.actions,
                actions = _props$actions === undefined ? _react2.default.createElement(_Actions2.default, null) : _props$actions,
                resource = _props.resource,
                hasCreate = _props.hasCreate,
                title = _props.title,
                data = _props.data,
                ids = _props.ids,
                total = _props.total,
                children = _props.children,
                isLoading = _props.isLoading,
                translate = _props.translate,
                theme = _props.theme;
            var key = this.state.key;

            var query = this.getQuery();
            var filterValues = query.filter;
            var basePath = this.getBasePath();

            var resourceName = translate('resources.' + resource + '.name', {
                smart_count: 2,
                _: _inflection2.default.humanize(_inflection2.default.pluralize(resource))
            });
            var defaultTitle = translate('aor.page.list', { name: '' + resourceName });
            var titleElement = _react2.default.createElement(_Title2.default, { title: title, defaultTitle: defaultTitle });
            var muiTheme = (0, _getMuiTheme2.default)(theme);
            var prefix = (0, _autoprefixer2.default)(muiTheme);

            return _react2.default.createElement(
                'div',
                { className: 'list-page' },
                _react2.default.createElement(
                    _Card.Card,
                    { style: { opacity: isLoading ? 0.8 : 1 } },
                    _react2.default.createElement(
                        'div',
                        { style: prefix(styles.header) },
                        _react2.default.createElement(_ViewTitle2.default, { title: titleElement }),
                        actions && _react2.default.cloneElement(actions, {
                            resource: resource,
                            filters: filters,
                            filterValues: filterValues,
                            basePath: basePath,
                            hasCreate: hasCreate,
                            displayedFilters: this.state,
                            showFilter: this.showFilter,
                            refresh: this.refresh,
                            theme: theme
                        })
                    ),
                    filters && _react2.default.cloneElement(filters, {
                        resource: resource,
                        hideFilter: this.hideFilter,
                        filterValues: filterValues,
                        displayedFilters: this.state,
                        setFilters: this.setFilters,
                        context: 'form'
                    }),
                    isLoading || total > 0 ? _react2.default.createElement(
                        'div',
                        { key: key },
                        children && _react2.default.cloneElement(children, {
                            resource: resource,
                            ids: ids,
                            data: data,
                            currentSort: { field: query.sort, order: query.order },
                            basePath: basePath,
                            isLoading: isLoading,
                            setSort: this.setSort
                        }),
                        pagination && _react2.default.cloneElement(pagination, {
                            total: total,
                            page: parseInt(query.page, 10),
                            perPage: parseInt(query.perPage, 10),
                            setPage: this.setPage
                        })
                    ) : _react2.default.createElement(
                        _Card.CardText,
                        { style: styles.noResults },
                        translate('aor.navigation.no_results')
                    )
                )
            );
        }
    }]);
    return List;
}(_react.Component);

List.propTypes = {
    // the props you can change
    title: _propTypes2.default.any,
    filter: _propTypes2.default.object,
    filters: _propTypes2.default.element,
    pagination: _propTypes2.default.element,
    actions: _propTypes2.default.element,
    perPage: _propTypes2.default.number.isRequired,
    sort: _propTypes2.default.shape({
        field: _propTypes2.default.string,
        order: _propTypes2.default.string
    }),
    children: _propTypes2.default.element.isRequired,
    // the props managed by admin-on-rest
    changeListParams: _propTypes2.default.func.isRequired,
    crudGetList: _propTypes2.default.func.isRequired,
    data: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
    filterValues: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
    hasCreate: _propTypes2.default.bool.isRequired,
    ids: _propTypes2.default.array,
    isLoading: _propTypes2.default.bool.isRequired,
    location: _propTypes2.default.object.isRequired,
    path: _propTypes2.default.string,
    params: _propTypes2.default.object.isRequired,
    push: _propTypes2.default.func.isRequired,
    query: _propTypes2.default.object.isRequired,
    resource: _propTypes2.default.string.isRequired,
    total: _propTypes2.default.number.isRequired,
    translate: _propTypes2.default.func.isRequired,
    theme: _propTypes2.default.object.isRequired
};

List.defaultProps = {
    filter: {},
    filterValues: {},
    perPage: 10,
    sort: {
        field: 'id',
        order: _queryReducer.SORT_DESC
    },
    theme: _defaultTheme2.default
};

var getLocationSearch = function getLocationSearch(props) {
    return props.location.search;
};
var getQuery = (0, _reselect.createSelector)(getLocationSearch, function (locationSearch) {
    var query = (0, _queryString.parse)(locationSearch);
    if (query.filter && typeof query.filter === 'string') {
        query.filter = JSON.parse(query.filter);
    }
    return query;
});

function mapStateToProps(state, props) {
    var resourceState = state.admin[props.resource];
    return {
        query: getQuery(props),
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
        filterValues: resourceState.list.params.filter
    };
}

var enhance = (0, _compose2.default)((0, _reactRedux.connect)(mapStateToProps, {
    crudGetList: _dataActions.crudGetList,
    changeListParams: _listActions.changeListParams,
    push: _reactRouterRedux.push
}), _translate2.default);

exports.default = enhance(List);