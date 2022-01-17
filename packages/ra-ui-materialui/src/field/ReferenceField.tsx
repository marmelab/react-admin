import * as React from 'react';
import { styled } from '@mui/material/styles';
import { FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import {
    useReference,
    UseReferenceResult,
    LinkToType,
    ResourceContextProvider,
    RecordContextProvider,
    RaRecord,
    useRecordContext,
    useCreateInternalLink,
    Identifier,
} from 'ra-core';

import { LinearProgress } from '../layout';
import { Link } from '../Link';
import { PublicFieldProps, fieldPropTypes, InjectedFieldProps } from './types';

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop should be the name of one of the <Resource> components
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
 * <ReferenceField label="User" source="userId" reference="users" link={(record, reference) => "/path/to/${reference}/${record}"}>
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @default
 * In previous versions of React-Admin, the prop `linkType` was used. It is now deprecated and replaced with `link`. However
 * backward-compatibility is still kept
 */
export const ReferenceField: FC<ReferenceFieldProps> = props => {
    const { source, emptyText, ...rest } = props;
    const record = useRecordContext(props);
    const id = get(record, source);

    return id == null ? (
        emptyText ? (
            <Typography component="span" variant="body2">
                {emptyText}
            </Typography>
        ) : null
    ) : (
        <NonEmptyReferenceField {...rest} record={record} id={id} />
    );
};

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: fieldPropTypes.label,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    sortByOrder: fieldPropTypes.sortByOrder,
    source: PropTypes.string.isRequired,
    translateChoice: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    // @ts-ignore
    link: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]).isRequired,
};

ReferenceField.defaultProps = {
    addLabel: true,
    link: 'edit',
};

export interface ReferenceFieldProps<RecordType extends RaRecord = any>
    extends PublicFieldProps,
        InjectedFieldProps<RecordType> {
    children: ReactElement;
    reference: string;
    resource?: string;
    source: string;
    translateChoice?: Function | boolean;
    link?: LinkToType;
}

/**
 * This intermediate component is made necessary by the useReference hook,
 * which cannot be called conditionally when get(record, source) is empty.
 */
export const NonEmptyReferenceField: FC<
    Omit<ReferenceFieldProps, 'emptyText' | 'source'> & { id: Identifier }
> = ({ children, id, record, reference, link, ...props }) => {
    if (React.Children.count(children) !== 1) {
        throw new Error('<ReferenceField> only accepts a single child');
    }
    const createInternalLink = useCreateInternalLink();
    const resourceLinkPath =
        link === false
            ? false
            : createInternalLink({
                  resource: reference,
                  id,
                  type:
                      typeof link === 'function'
                          ? link(record, reference)
                          : link,
              });

    return (
        <ResourceContextProvider value={reference}>
            <PureReferenceFieldView
                reference={reference}
                {...props}
                {...useReference({
                    reference,
                    id,
                })}
                resourceLinkPath={resourceLinkPath}
            >
                {children}
            </PureReferenceFieldView>
        </ResourceContextProvider>
    );
};

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

export const ReferenceFieldView: FC<ReferenceFieldViewProps> = props => {
    const {
        children,
        className,
        error,
        isLoading,
        referenceRecord,
        resourceLinkPath,
    } = props;

    if (error) {
        return (
            /* eslint-disable jsx-a11y/role-supports-aria-props */
            <ErrorIcon
                aria-errormessage={error.message ? error.message : error}
                role="presentation"
                color="error"
                fontSize="small"
            />
            /* eslint-enable */
        );
    }
    if (isLoading) {
        return <LinearProgress />;
    }
    if (!referenceRecord) {
        return null;
    }

    if (resourceLinkPath) {
        return (
            <Root>
                <RecordContextProvider value={referenceRecord}>
                    <Link
                        to={resourceLinkPath as string}
                        className={`${ReferenceFieldClasses.link} ${className}`}
                        onClick={stopPropagation}
                    >
                        {children}
                    </Link>
                </RecordContextProvider>
            </Root>
        );
    }

    return (
        <RecordContextProvider value={referenceRecord}>
            {children}
        </RecordContextProvider>
    );
};

ReferenceFieldView.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
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
        UseReferenceResult {
    reference: string;
    resource?: string;
    translateChoice?: Function | boolean;
    resourceLinkPath?: string | false;
    children?: ReactElement;
}

const PureReferenceFieldView = memo(ReferenceFieldView);

const PREFIX = 'RaReferenceField';

export const ReferenceFieldClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled('span', { name: PREFIX })(({ theme }) => ({
    [`& .${ReferenceFieldClasses.link}`]: {},
}));
