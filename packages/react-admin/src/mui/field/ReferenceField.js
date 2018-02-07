import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';

import LinearProgress from '../layout/LinearProgress';
import Link from '../Link';
import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions/accumulateActions';
import linkToRecord from '../../util/linkToRecord';
import sanitizeRestProps from './sanitizeRestProps';

const styles = theme => ({
    link: {
        color: theme.palette.secondary.main,
    },
});

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
        this.fetchReference(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReference(nextProps);
        }
    }

    fetchReference(props) {
        const source = get(props.record, props.source);
        if (source !== null && typeof source !== 'undefined') {
            this.props.crudGetManyAccumulate(props.reference, [source]);
        }
    }

    render() {
        const {
            allowEmpty,
            basePath,
            children,
            className,
            classes,
            linkType,
            record,
            reference,
            referenceRecord,
            resource,
            source,
            translateChoice,
            ...rest
        } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const rootPath = basePath.replace(`/${resource}`, '');

        const href = linkToRecord(
            `${rootPath}/${reference}`,
            get(record, source)
        );

        let resourceLinkPath =
            linkType === 'edit' || linkType === true
                ? href
                : linkType === 'show' ? `${href}/show` : false;

        if (linkType === 'edit' || linkType === true || linkType === 'show') {
            return (
                <Link
                    className={classnames(classes.link, className)}
                    to={resourceLinkPath}
                    {...sanitizeRestProps(rest)}
                >
                    {React.cloneElement(children, {
                        record: referenceRecord,
                        resource: reference,
                        allowEmpty,
                        basePath,
                        translateChoice: false,
                    })}
                </Link>
            );
        }

        return React.cloneElement(children, {
            record: referenceRecord,
            resource: reference,
            allowEmpty,
            basePath,
            translateChoice: false,
            ...sanitizeRestProps(rest),
        });
    }
}

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string.isRequired,
    translateChoice: PropTypes.func,
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
};

ReferenceField.defaultProps = {
    allowEmpty: false,
    classes: {},
    linkType: 'edit',
    referenceRecord: null,
    record: {},
};

const mapStateToProps = (state, props) => ({
    referenceRecord:
        state.admin.resources[props.reference].data[
            get(props.record, props.source)
        ],
});

const ConnectedReferenceField = compose(
    connect(mapStateToProps, {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }),
    withStyles(styles)
)(ReferenceField);

ConnectedReferenceField.defaultProps = {
    addLabel: true,
};

export default ConnectedReferenceField;
