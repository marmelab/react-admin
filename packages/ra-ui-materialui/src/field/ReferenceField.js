import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import { CoreReferenceField } from 'ra-core';

import LinearProgress from '../layout/LinearProgress';
import Link from '../Link';
import sanitizeRestProps from './sanitizeRestProps';

const styles = theme => ({
    link: {
        color: theme.palette.secondary.main,
    },
});

export const InnerReferenceField = ({
    allowEmpty,
    basePath,
    children,
    className,
    classes = {},
    isLoading,
    reference,
    referenceRecord,
    resourceLinkPath,
    ...rest
}) => {
    if (React.Children.count(children) !== 1) {
        throw new Error('<ReferenceField> only accepts a single child');
    }

    if (isLoading) {
        return <LinearProgress />;
    }

    if (resourceLinkPath) {
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
};

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
export const ReferenceField = ({
    allowEmpty,
    basePath,
    children,
    className,
    classes,
    linkType,
    record,
    reference,
    resource,
    source,
    translateChoice,
    ...rest
}) => (
    <CoreReferenceField
        {...{
            allowEmpty,
            basePath,
            linkType,
            record,
            reference,
            resource,
            source,
        }}
    >
        {({ isLoading, referenceRecord, resourceLinkPath }) => (
            <InnerReferenceField
                {...{
                    allowEmpty,
                    basePath,
                    children,
                    className,
                    classes,
                    isLoading,
                    reference,
                    referenceRecord,
                    resourceLinkPath,
                    ...rest,
                }}
            />
        )}
    </CoreReferenceField>
);

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
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
    record: {},
};

const EnhancedReferenceField = withStyles(styles)(ReferenceField);

EnhancedReferenceField.defaultProps = {
    addLabel: true,
};

export default EnhancedReferenceField;
