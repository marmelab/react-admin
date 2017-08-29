'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReferenceArrayField = undefined;

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

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _accumulateActions = require('../../actions/accumulateActions');

var _oneToMany = require('../../reducer/references/oneToMany');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A container component that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the products of the current order as datagrid
 * // order = {
 * //   id: 123,
 * //   product_ids: [456, 457, 458],
 * // }
 * <ReferenceArrayField label="Products" reference="products" source="product_ids">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="description" />
 *         <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceArrayField>
 *
 * @example Display all the categories of the current product as a list of chips
 * // product = {
 * //   id: 456,
 * //   category_ids: [11, 22, 33],
 * // }
 * <ReferenceArrayField label="Categories" reference="categories" source="category_ids">
 *     <SingleFieldList>
 *         <ChipField source="name" />
 *     </SingleFieldList>
 * </ReferenceArrayField>
 *
 */
var ReferenceArrayField = exports.ReferenceArrayField = function (_Component) {
    (0, _inherits3.default)(ReferenceArrayField, _Component);

    function ReferenceArrayField() {
        (0, _classCallCheck3.default)(this, ReferenceArrayField);
        return (0, _possibleConstructorReturn3.default)(this, (ReferenceArrayField.__proto__ || Object.getPrototypeOf(ReferenceArrayField)).apply(this, arguments));
    }

    (0, _createClass3.default)(ReferenceArrayField, [{
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
                crudGetManyAccumulate = _ref.crudGetManyAccumulate,
                reference = _ref.reference,
                ids = _ref.ids;

            crudGetManyAccumulate(reference, ids);
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
                throw new Error('<ReferenceArrayField> only accepts a single child (like <Datagrid>)');
            }

            if (ids.length !== 0 && Object.keys(data).length !== ids.length) {
                return _react2.default.createElement(_LinearProgress2.default, { style: { marginTop: '1em' } });
            }

            var referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
            return _react2.default.cloneElement(children, {
                resource: reference,
                ids: ids,
                data: data,
                isLoading: isLoading,
                basePath: referenceBasePath,
                currentSort: {}
            });
        }
    }]);
    return ReferenceArrayField;
}(_react.Component);

ReferenceArrayField.propTypes = {
    addLabel: _propTypes2.default.bool,
    basePath: _propTypes2.default.string.isRequired,
    children: _propTypes2.default.element.isRequired,
    crudGetManyAccumulate: _propTypes2.default.func.isRequired,
    data: _propTypes2.default.object,
    ids: _propTypes2.default.array.isRequired,
    isLoading: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    record: _propTypes2.default.object.isRequired,
    reference: _propTypes2.default.string.isRequired,
    resource: _propTypes2.default.string.isRequired,
    source: _propTypes2.default.string.isRequired
};

var emptyIds = [];

var mapStateToProps = function mapStateToProps(state, props) {
    var record = props.record,
        source = props.source,
        reference = props.reference;

    var ids = (0, _lodash2.default)(record, source) || emptyIds;
    return {
        data: (0, _oneToMany.getReferencesByIds)(state, reference, ids),
        ids: ids,
        isLoading: state.admin.loading > 0
    };
};

var ConnectedReferenceArrayField = (0, _reactRedux.connect)(mapStateToProps, {
    crudGetManyAccumulate: _accumulateActions.crudGetManyAccumulate
})(ReferenceArrayField);

ConnectedReferenceArrayField.defaultProps = {
    addLabel: true
};

exports.default = ConnectedReferenceArrayField;