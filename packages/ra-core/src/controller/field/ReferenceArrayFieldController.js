import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import get from 'lodash/get';

import { crudGetManyAccumulate } from '../../actions';

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
export class ReferenceArrayFieldController extends Component {
    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.record || {}).id !== (nextProps.record || {}).id) {
            this.fetchReferences(nextProps);
        }
    }

    fetchReferences({ crudGetManyAccumulate, reference, ids } = this.props) {
        crudGetManyAccumulate(reference, ids);
    }

    render() {
        const {
            resource,
            reference,
            data,
            ids,
            children,
            basePath,
        } = this.props;

        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak

        return children({
            isLoading: ids.length !== 0 && !data,
            ids,
            data,
            referenceBasePath,
            currentSort: {},
        });
    }
}

ReferenceArrayFieldController.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.func.isRequired,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    data: PropTypes.object,
    ids: PropTypes.array.isRequired,
    label: PropTypes.string,
    record: PropTypes.object.isRequired,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
};

const emptyIds = [];

const idsSelector = (state, props) =>
    get(props.record, props.source) || emptyIds;
const resourceSelector = (state, props) =>
    state.admin.resources[props.reference];
const makeDataSelector = () =>
    createSelector([resourceSelector, idsSelector], (resource, ids) => {
        const references = ids
            .map(id => resource && resource.data[id])
            .filter(r => typeof r !== 'undefined')
            .reduce(
                (prev, record) => ({
                    ...prev,
                    [record.id]: record,
                }),
                {}
            );

        return Object.keys(references).length > 0 ? references : null;
    });

const makeMapStateToProps = () => {
    const getData = makeDataSelector();
    return (state, props) => ({
        ids: idsSelector(state, props),
        data: getData(state, props),
    });
};

export default connect(
    makeMapStateToProps,
    { crudGetManyAccumulate }
)(ReferenceArrayFieldController);
