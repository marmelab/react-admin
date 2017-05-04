import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions/dataActions';
import { getIds, getReferences, nameRelatedTo } from '../../reducer/references/oneToMany';

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
export class ReferenceManyField extends Component {
    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferences(nextProps);
        }
    }

    fetchReferences({ reference, record, resource, target, perPage, sort, filter } = this.props) {
        const { crudGetManyReference } = this.props;
        const pagination = { page: 1, perPage };
        const relatedTo = nameRelatedTo(reference, record.id, resource, target);
        crudGetManyReference(reference, target, record.id, relatedTo, pagination, sort, filter);
    }

    render() {
        const { resource, reference, data, ids, children, basePath } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceManyField> only accepts a single child (like <Datagrid>)');
        }
        if (typeof ids === 'undefined') {
            return <LinearProgress style={{ marginTop: '1em' }} />;
        }
        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return React.cloneElement(children, {
            resource: reference,
            ids,
            data,
            basePath: referenceBasePath,
            currentSort: {},
        });
    }
}

ReferenceManyField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetManyReference: PropTypes.func.isRequired,
    filter: PropTypes.object,
    ids: PropTypes.array,
    label: PropTypes.string,
    perPage: PropTypes.number,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    data: PropTypes.object,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

ReferenceManyField.defaultProps = {
    filter: {},
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    source: '',
};

function mapStateToProps(state, props) {
    const relatedTo = nameRelatedTo(props.reference, props.record.id, props.resource, props.target);
    return {
        data: getReferences(state, props.reference, relatedTo),
        ids: getIds(state, relatedTo),
    };
}

const ConnectedReferenceManyField = connect(mapStateToProps, {
    crudGetManyReference: crudGetManyReferenceAction,
})(ReferenceManyField);

ConnectedReferenceManyField.defaultProps = {
    addLabel: true,
    source: '',
};

export default ConnectedReferenceManyField;
