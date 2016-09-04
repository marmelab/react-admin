import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetManyReference as crudGetManyReferenceAction } from '../../actions/dataActions';
import { getReferences, relatedTo } from '../../reducer/references/oneToMany';

/**
 * Render related records in a list of a single field.
 *
 * The child field will be repeated as many times as there are related records.
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <ChipField source="title" />
 * </ReferenceManyField>
 */
export class ReferenceManyField extends Component {
    componentDidMount() {
        this.props.crudGetManyReference(this.props.reference, this.props.target, this.props.record.id, relatedTo(this.props.reference, this.props.record.id, this.props.resource, this.props.target));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetManyReference(nextProps.reference, nextProps.target, nextProps.record.id, relatedTo(nextProps.reference, nextProps.record.id, nextProps.resource, nextProps.target));
        }
    }

    render() {
        const { resource, reference, referenceRecords, children, basePath } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceManyField> only accepts a single child');
        }
        if (typeof referenceRecords === 'undefined') {
            return <LinearProgress style={{ marginTop: '1em' }} />;
        }
        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.keys(referenceRecords).map(index =>
                    React.cloneElement(children, {
                        key: index,
                        record: referenceRecords[index],
                        resource: reference,
                        basePath: referenceBasePath,
                    })
                )}
            </div>
        );
    }
}

ReferenceManyField.propTypes = {
    resource: PropTypes.string.isRequired,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    referenceRecords: PropTypes.object,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetManyReference: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        referenceRecords: getReferences(state, props.reference, relatedTo(props.reference, props.record.id, props.resource, props.target)),
    };
}

export default connect(mapStateToProps, {
    crudGetManyReference: crudGetManyReferenceAction,
})(ReferenceManyField);
