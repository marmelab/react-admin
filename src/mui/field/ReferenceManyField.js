import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions/dataActions';
import { getReferences, nameRelatedTo } from '../../reducer/references/oneToMany';

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
 */
export class ReferenceManyField extends Component {
    componentDidMount() {
        const relatedTo = nameRelatedTo(this.props.reference, this.props.record.id, this.props.resource, this.props.target);
        this.props.crudGetManyReference(this.props.reference, this.props.target, this.props.record.id, relatedTo);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            const relatedTo = nameRelatedTo(nextProps.reference, nextProps.record.id, nextProps.resource, nextProps.target);
            this.props.crudGetManyReference(nextProps.reference, nextProps.target, nextProps.record.id, relatedTo);
        }
    }

    render() {
        const { resource, reference, referenceRecords, children, basePath } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceManyField> only accepts a single child (like <Datagrid>)');
        }
        if (typeof referenceRecords === 'undefined') {
            return <LinearProgress style={{ marginTop: '1em' }} />;
        }
        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return React.cloneElement(children, {
            resource: reference,
            ids: Object.keys(referenceRecords),
            data: referenceRecords,
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
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecords: PropTypes.object,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
    const relatedTo = nameRelatedTo(props.reference, props.record.id, props.resource, props.target);
    return {
        referenceRecords: getReferences(state, props.reference, relatedTo),
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
