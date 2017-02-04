import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';
import { crudGetOneReference as crudGetOneReferenceAction } from '../../actions/referenceActions';
import linkToRec from '../../util/linkToRecord'

/**
 * @example
 * <ReferenceField label="Post" source="post_id" reference="posts">
 *     <TextField source="title" />
 * </ReferenceField>
 */
export class ReferenceField extends Component {
    componentDidMount() {
        this.props.crudGetOneReference(this.props.reference, get(this.props.record, this.props.source));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.props.crudGetOneReference(nextProps.reference, get(nextProps.record, nextProps.source));
        }
    }

    render() {
        const { record, source, reference, referenceRecord, basePath, allowEmpty, children, elStyle, linkToRecord } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        return (
            <Link style={elStyle} to={linkToRec(`${rootPath}/${reference}`, get(record, source)) + (linkToRecord ? '/show' : '')}>
                {React.cloneElement(children, {
                    record: referenceRecord,
                    resource: reference,
                    allowEmpty,
                    basePath,
                })}
            </Link>
        );
    }
}

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetOneReference: PropTypes.func.isRequired,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    source: PropTypes.string.isRequired,
	linkToRecord: PropTypes.bool,
};

ReferenceField.defaultProps = {
    addLabel: true,
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    linkToRecord: true,
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[get(props.record, props.source)],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReference: crudGetOneReferenceAction,
})(ReferenceField);
