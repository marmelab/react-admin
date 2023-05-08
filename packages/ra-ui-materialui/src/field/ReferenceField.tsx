import * as React from 'react';
import { FC, memo, ReactNode } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Typography, SxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import {
    useReference,
    UseReferenceResult,
    LinkToType,
    ResourceContextProvider,
    RecordContextProvider,
    RaRecord,
    useRecordContext,
    useCreatePath,
    Identifier,
    useGetRecordRepresentation,
    useResourceDefinition,
    useTranslate,
} from 'ra-core';

import { LinearProgress } from '../layout';
import { Link } from '../Link';
import { PublicFieldProps, fieldPropTypes, InjectedFieldProps } from './types';
import { UseQueryOptions } from 'react-query';

/**
 * Fetch reference record, and render its representation, or delegate rendering to child component.
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example // using recordRepresentation
 * <ReferenceField label="User" source="userId" reference="users" />
 *
 * @example // using a Field component to represent the record
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * @example // By default, includes a link to the <Edit> page of the related record
 * // (`/users/:userId` in the previous example).
 * // Set the `link` prop to "show" to link to the <Show> page instead.
 * <ReferenceField label="User" source="userId" reference="users" link="show" />
 *
 * @example // You can also prevent `<ReferenceField>` from adding link to children
 * // by setting `link` to false.
 * <ReferenceField label="User" source="userId" reference="users" link={false} />
 *
 * @example // Alternatively, you can also pass a custom function to `link`.
 * // It must take reference and record as arguments and return a string
 * <ReferenceField label="User" source="userId" reference="users" link={(record, reference) => "/path/to/${reference}/${record}"} />
 *
 * @default
 * In previous versions of React-Admin, the prop `linkType` was used. It is now deprecated and replaced with `link`. However
 * backward-compatibility is still kept
 */
export const ReferenceField: FC<ReferenceFieldProps> = props => {
    const { source, emptyText, ...rest } = props;
    const record = useRecordContext(props);
    const id = get(record, source);
    const translate = useTranslate();

    return id == null ? (
        emptyText ? (
            <Typography component="span" variant="body2">
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null
    ) : (
        <NonEmptyReferenceField
            {...rest}
            emptyText={emptyText}
            record={record}
            id={id}
        />
    );
};

ReferenceField.propTypes = {
    children: PropTypes.node,
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
    link: 'edit',
};

export interface ReferenceFieldProps<RecordType extends RaRecord = any>
    extends PublicFieldProps,
        InjectedFieldProps<RecordType> {
    children?: ReactNode;
    queryOptions?: UseQueryOptions<RecordType[], Error> & { meta?: any };
    reference: string;
    resource?: string;
    source: string;
    translateChoice?: Function | boolean;
    link?: LinkToType;
    sx?: SxProps;
}

/**
 * This intermediate component is made necessary by the useReference hook,
 * which cannot be called conditionally when get(record, source) is empty.
 */
export const NonEmptyReferenceField: FC<
    Omit<ReferenceFieldProps, 'source'> & { id: Identifier }
> = ({ children, id, record, reference, link, queryOptions, ...props }) => {
    const createPath = useCreatePath();
    const resourceDefinition = useResourceDefinition({ resource: reference });

    const resourceLinkPath =
        link === false ||
        (link === 'edit' && !resourceDefinition.hasEdit) ||
        (link === 'show' && !resourceDefinition.hasShow)
            ? false
            : createPath({
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
                    options: queryOptions,
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
        emptyText,
        error,
        isLoading,
        reference,
        referenceRecord,
        resourceLinkPath,
        sx,
    } = props;
    const getRecordRepresentation = useGetRecordRepresentation(reference);
    const translate = useTranslate();

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
        return emptyText ? (
            <>{emptyText && translate(emptyText, { _: emptyText })}</>
        ) : null;
    }

    let child = children || (
        <Typography component="span" variant="body2">
            {getRecordRepresentation(referenceRecord)}
        </Typography>
    );

    return resourceLinkPath ? (
        <Root className={className} sx={sx}>
            <RecordContextProvider value={referenceRecord}>
                <Link
                    to={resourceLinkPath as string}
                    className={ReferenceFieldClasses.link}
                    onClick={stopPropagation}
                >
                    {child}
                </Link>
            </RecordContextProvider>
        </Root>
    ) : (
        <RecordContextProvider value={referenceRecord}>
            {child}
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
    children?: ReactNode;
    sx?: SxProps;
}

const PureReferenceFieldView = memo(ReferenceFieldView);

const PREFIX = 'RaReferenceField';

export const ReferenceFieldClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ReferenceFieldClasses.link}`]: {
        '& > *': {
            color: theme.palette.primary.main,
        },
    },
}));
