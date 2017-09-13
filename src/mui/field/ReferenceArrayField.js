import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions/accumulateActions';
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
export class ReferenceArrayField extends Component {
    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
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
            isLoading,
        } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error(
                '<ReferenceArrayField> only accepts a single child (like <Datagrid>)'
            );
        }

        if (ids.length !== 0 && Object.keys(data).length !== ids.length) {
            return <LinearProgress style={{ marginTop: '1em' }} />;
        }

        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return React.cloneElement(children, {
            resource: reference,
            ids,
            data,
            isLoading,
            basePath: referenceBasePath,
            currentSort: {},
        });
    }
}

ReferenceArrayField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    data: PropTypes.object,
    ids: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    record: PropTypes.object.isRequired,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
};

const emptyIds = [];

const mapStateToProps = (state, props) => {
    const { record, source, reference } = props;
    const ids = get(record, source) || emptyIds;
    return {
        data: getReferencesByIds(state, reference, ids),
        ids,
        isLoading: state.admin.loading > 0,
    };
};

const ConnectedReferenceArrayField = connect(mapStateToProps, {
    crudGetManyAccumulate: crudGetManyAccumulateAction,
})(ReferenceArrayField);

ConnectedReferenceArrayField.defaultProps = {
    addLabel: true,
};

export default ConnectedReferenceArrayField;
