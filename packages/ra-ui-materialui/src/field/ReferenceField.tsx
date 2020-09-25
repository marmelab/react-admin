import * as React from 'react';
import { Children, cloneElement, FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import {
    useReference,
    UseReferenceProps,
    getResourceLinkPath,
    LinkToType,
} from 'ra-core';

import LinearProgress from '../layout/LinearProgress';
import Link from '../Link';
import sanitizeRestProps from './sanitizeRestProps';
import { PublicFieldProps, fieldPropTypes, InjectedFieldProps } from './types';
import { ClassesOverride } from '../types';

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

const ReferenceField: FC<ReferenceFieldProps> = ({
    children,
    record,
    source,
    ...props
}) => {
    if (React.Children.count(children) !== 1) {
        throw new Error('<ReferenceField> only accepts a single child');
    }
    const { basePath, resource } = props;
    const resourceLinkPath = getResourceLinkPath({
        ...props,
        resource,
        record,
        source,
        basePath,
    });

    return (
        <PureReferenceFieldView
            {...props}
            {...useReference({
                reference: props.reference,
                id: get(record, source),
            })}
            resourceLinkPath={resourceLinkPath}
        >
            {children}
        </PureReferenceFieldView>
    );
};

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    classes: PropTypes.any,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
    translateChoice: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
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
    addLabel: true,
    classes: {},
    link: 'edit',
};

export interface ReferenceFieldProps
    extends PublicFieldProps,
        InjectedFieldProps {
    children: ReactElement;
    classes?: ClassesOverride<typeof useStyles>;
    reference: string;
    resource?: string;
    source: string;
    translateChoice?: Function | boolean;
    linkType?: LinkToType;
    link?: LinkToType;
}

const useStyles = makeStyles(
    theme => ({
        link: {
            color: theme.palette.primary.main,
        },
    }),
    { name: 'RaReferenceField' }
);

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

export const ReferenceFieldView: FC<ReferenceFieldViewProps> = props => {
    const {
        basePath,
        children,
        className,
        classes: classesOverride,
        error,
        loaded,
        loading,
        record,
        reference,
        referenceRecord,
        resource,
        resourceLinkPath,
        source,
        translateChoice = false,
        ...rest
    } = props;
    const classes = useStyles(props);
    if (!loaded) {
        return <LinearProgress />;
    }
    if (error) {
        return (
            <ErrorIcon
                aria-errormessage={error.message ? error.message : error}
                color="error"
                fontSize="small"
                role="presentation"
            />
        );
    }
    if (!referenceRecord) {
        return null;
    }

    if (resourceLinkPath) {
        return (
            <Link
                to={resourceLinkPath as string}
                className={className}
                onClick={stopPropagation}
            >
                {cloneElement(Children.only(children), {
                    className: classnames(
                        children.props.className,
                        classes.link // force color override for Typography components
                    ),
                    record: referenceRecord,
                    resource: reference,
                    basePath,
                    translateChoice,
                    ...sanitizeRestProps(rest),
                })}
            </Link>
        );
    }

    return cloneElement(Children.only(children), {
        record: referenceRecord,
        resource: reference,
        basePath,
        translateChoice,
        ...sanitizeRestProps(rest),
    });
};

ReferenceFieldView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.any,
    loading: PropTypes.bool,
    record: PropTypes.any,
    reference: PropTypes.string,
    referenceRecord: PropTypes.any,
    resource: PropTypes.string,
    resourceLinkPath: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([false]),
    ]) as React.Validator<string | false>,
    source: PropTypes.string,
    translateChoice: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export interface ReferenceFieldViewProps
    extends PublicFieldProps,
        InjectedFieldProps,
        UseReferenceProps {
    classes?: ClassesOverride<typeof useStyles>;
    reference: string;
    resource?: string;
    translateChoice?: Function | boolean;
    resourceLinkPath?: ReturnType<typeof getResourceLinkPath>;
    children?: ReactElement;
}

const PureReferenceFieldView = memo(ReferenceFieldView);

export default ReferenceField;
