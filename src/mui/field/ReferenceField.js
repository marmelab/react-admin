import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';
import { crudGetOneReference as crudGetOneReferenceAction } from '../../actions/referenceActions';
import linkToRecord from '../../util/linkToRecord';

/**
 * @example Link to `/users/:userId` (`<Edit>` view)
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * This is equivalent to:
 *
 * @example Link to `/users/:userId` (`<Edit>` view)
 * <ReferenceField label="User" source="userId" reference="users" linkType="edit">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can set `linkType` to `"show"` to link to the `<Show>` view.
 *
 * @example Link to `/users/:userId/show` (`<Show>` view)
 * <ReferenceField label="User" source="userId" reference="users" linkType="edit">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to other values.
 *
 * @example No link
 * <ReferenceField label="User" source="userId" reference="users" linkType="">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @example Custom link
 * <ReferenceField label="User" source="userId" reference="users" linkType="none">
 *     <FunctionField render={record => (<a href={record.homepage}>{record.name}</a>)} />
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
        if (linkType === "edit") {
            return (<Link style={elStyle} to={href}>
                {child}
            </Link>);
        } else if (linkType === "show") {
            return (<Link style={elStyle} to={href + '/show'}>
                {child}
            </Link>);
        } else {
            return React.cloneElement(children, {
                record: referenceRecord,
                resource: reference,
                style: elStyle,
                allowEmpty,
                basePath,
            });
        }
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
    linkType: PropTypes.string.isRequired,
};

ReferenceField.defaultProps = {
    addLabel: true,
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    linkType: "edit",
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[get(props.record, props.source)],
    };
}

export default connect(mapStateToProps, {
    crudGetOneReference: crudGetOneReferenceAction,
})(ReferenceField);
