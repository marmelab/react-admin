import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { useReferenceField } from 'ra-core';

import LinearProgress from '../layout/LinearProgress';
import Link from '../Link';
import sanitizeRestProps from './sanitizeRestProps';

const styles = theme =>
    createStyles({
        link: {
            color: theme.palette.primary.main,
        },
    });

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

export const ReferenceFieldView = ({
    allowEmpty,
    basePath,
    children,
    className,
    classes = {},
    isLoading,
    record,
    reference,
    referenceRecord,
    resource,
    resourceLinkPath,
    source,
    translateChoice = false,
    ...rest
}) => {
    if (isLoading) {
        return <LinearProgress />;
    }

    if (resourceLinkPath) {
        return (
            <Link
                to={resourceLinkPath}
                className={className}
                onClick={stopPropagation}
            >
                {React.cloneElement(Children.only(children), {
                    className: classnames(
                        children.props.className,
                        classes.link // force color override for Typography components
                    ),
                    record: referenceRecord,
                    resource: reference,
                    allowEmpty,
                    basePath,
                    translateChoice,
                    ...sanitizeRestProps(rest),
                })}
            </Link>
        );
    }

    return React.cloneElement(Children.only(children), {
        record: referenceRecord,
        resource: reference,
        allowEmpty,
        basePath,
        translateChoice,
        ...sanitizeRestProps(rest),
    });
};

ReferenceFieldView.propTypes = {
    allowEmpty: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    reference: PropTypes.string,
    referenceRecord: PropTypes.object,
    resource: PropTypes.string,
    resourceLinkPath: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
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
 * @default
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the `link` prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" link="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @default
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `link` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" link={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @default
 * Alternatively, you can also pass a custom function to `link`. It must take reference and record
 * as arguments and return a string
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" link={(reference, record) => "/path/to/${reference}/${record}"}>
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @default
 * In previous versions of React-Admin, the prop `linkType` was used. It is now deprecated and replaced with `link`. However
 * backward-compatibility is still kept
 */

const ReferenceField = ({ children, ...props }) => {
    if (React.Children.count(children) !== 1) {
        throw new Error('<ReferenceField> only accepts a single child');
    }

    const { isLoading, referenceRecord, resourceLinkPath } = useReferenceField(
        props
    );

    return (
        <ReferenceFieldView
            {...props}
            children={children}
            isLoading={isLoading}
            referenceRecord={referenceRecord}
            resourceLinkPath={resourceLinkPath}
        />
    );
};

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
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    translateChoice: PropTypes.func,
    linkType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    link: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]).isRequired,
};

ReferenceField.defaultProps = {
    allowEmpty: false,
    classes: {},
    link: 'edit',
    record: {},
};

const EnhancedReferenceField = withStyles(styles)(ReferenceField);

EnhancedReferenceField.defaultProps = {
    addLabel: true,
};

EnhancedReferenceField.displayName = 'EnhancedReferenceField';

export default EnhancedReferenceField;
