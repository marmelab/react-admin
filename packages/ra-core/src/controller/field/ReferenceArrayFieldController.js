import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions';
import { getReferencesByIds } from '../../reducer/admin/references/oneToMany';

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
            loadedOnce: data != undefined,
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

const mapStateToProps = (state, props) => {
    const { record, source, reference } = props;
    const ids = get(record, source) || [];
    return {
        data: getReferencesByIds(state, reference, ids),
        ids,
    };
};

export default connect(
    mapStateToProps,
    {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }
)(ReferenceArrayFieldController);
