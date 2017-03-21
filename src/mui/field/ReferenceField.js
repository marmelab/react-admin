import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';
import { crudGetOneReference as crudGetOneReferenceAction } from '../../actions/referenceActions';
import linkToRecord from '../../util/linkToRecord';

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
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
        const { record, source, reference, referenceRecord, basePath, allowEmpty, children, elStyle, linkType } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        const href = linkToRecord(`${rootPath}/${reference}`, get(record, source));
        const child = React.cloneElement(children, {
            record: referenceRecord,
            resource: reference,
            allowEmpty,
            basePath,
        });
        if (linkType === 'edit') {
            return <Link style={elStyle} to={href}>{child}</Link>;
        }
        if (linkType === 'show') {
            return <Link style={elStyle} to={`${href}/show`}>{child}</Link>;
        }
        return React.cloneElement(children, {
            record: referenceRecord,
            resource: reference,
            style: elStyle,
            allowEmpty,
            basePath,
        });
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
    linkType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
};

ReferenceField.defaultProps = {
    addLabel: true,
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    linkType: 'edit',
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[get(props.record, props.source)],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReference: crudGetOneReferenceAction,
})(ReferenceField);
