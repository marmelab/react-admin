'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReferenceManyField = undefined;

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

var _LinearProgress = require('material-ui/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

var _dataActions = require('../../actions/dataActions');

var _oneToMany = require('../../reducer/references/oneToMany');

var _queryReducer = require('../../reducer/resource/list/queryReducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </ReferenceManyField>
 */
var ReferenceManyField = exports.ReferenceManyField = function (_Component) {
    (0, _inherits3.default)(ReferenceManyField, _Component);

    function ReferenceManyField(props) {
        (0, _classCallCheck3.default)(this, ReferenceManyField);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ReferenceManyField.__proto__ || Object.getPrototypeOf(ReferenceManyField)).call(this, props));

        _this.setSort = function (field) {
            var order = _this.state.sort.field === field && _this.state.sort.order === _queryReducer.SORT_ASC ? _queryReducer.SORT_DESC : _queryReducer.SORT_ASC;
            _this.setState({ sort: { field: field, order: order } }, _this.fetchReferences);
        };

        _this.state = { sort: props.sort };
        return _this;
    }

    (0, _createClass3.default)(ReferenceManyField, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.fetchReferences();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.record.id !== nextProps.record.id) {
                this.fetchReferences(nextProps);
            }
        }
    }, {
        key: 'fetchReferences',
        value: function fetchReferences() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props,
                reference = _ref.reference,
                record = _ref.record,
                resource = _ref.resource,
                target = _ref.target,
                perPage = _ref.perPage,
                filter = _ref.filter;

            var crudGetManyReference = this.props.crudGetManyReference;

            var pagination = { page: 1, perPage: perPage };
            var relatedTo = (0, _oneToMany.nameRelatedTo)(reference, record.id, resource, target);
            crudGetManyReference(reference, target, record.id, relatedTo, pagination, this.state.sort, filter);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                resource = _props.resource,
                reference = _props.reference,
                data = _props.data,
                ids = _props.ids,
                children = _props.children,
                basePath = _props.basePath,
                isLoading = _props.isLoading;

            if (_react2.default.Children.count(children) !== 1) {
                throw new Error('<ReferenceManyField> only accepts a single child (like <Datagrid>)');
            }
            if (typeof ids === 'undefined') {
                return _react2.default.createElement(_LinearProgress2.default, { style: { marginTop: '1em' } });
            }
            var referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
            return _react2.default.cloneElement(children, {
                resource: reference,
                ids: ids,
                data: data,
                isLoading: isLoading,
                basePath: referenceBasePath,
                currentSort: this.state.sort,
                setSort: this.setSort
            });
        }
    }]);
    return ReferenceManyField;
}(_react.Component);

ReferenceManyField.propTypes = {
    addLabel: _propTypes2.default.bool,
    basePath: _propTypes2.default.string.isRequired,
    children: _propTypes2.default.element.isRequired,
    crudGetManyReference: _propTypes2.default.func.isRequired,
    filter: _propTypes2.default.object,
    ids: _propTypes2.default.array,
    label: _propTypes2.default.string,
    perPage: _propTypes2.default.number,
    record: _propTypes2.default.object,
    reference: _propTypes2.default.string.isRequired,
    data: _propTypes2.default.object,
    resource: _propTypes2.default.string.isRequired,
    sort: _propTypes2.default.shape({
        field: _propTypes2.default.string,
        order: _propTypes2.default.oneOf(['ASC', 'DESC'])
    }),
    source: _propTypes2.default.string.isRequired,
    target: _propTypes2.default.string.isRequired,
    isLoading: _propTypes2.default.bool
};

ReferenceManyField.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: ''
};

function mapStateToProps(state, props) {
    var relatedTo = (0, _oneToMany.nameRelatedTo)(props.reference, props.record.id, props.resource, props.target);
    return {
        data: (0, _oneToMany.getReferences)(state, props.reference, relatedTo),
        ids: (0, _oneToMany.getIds)(state, relatedTo),
        isLoading: state.admin.loading > 0
    };
}

var ConnectedReferenceManyField = (0, _reactRedux.connect)(mapStateToProps, {
    crudGetManyReference: _dataActions.crudGetManyReference
})(ReferenceManyField);

ConnectedReferenceManyField.defaultProps = {
    addLabel: true,
    source: ''
};

exports.default = ConnectedReferenceManyField;