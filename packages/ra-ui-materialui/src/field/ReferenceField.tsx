import * as React from 'react';
import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import {
    type LinkToType,
    useGetRecordRepresentation,
    useTranslate,
    type RaRecord,
    ReferenceFieldBase,
    useReferenceFieldContext,
    UseReferenceFieldControllerResult,
    genericMemo,
} from 'ra-core';
import type { UseQueryOptions } from '@tanstack/react-query';
import clsx from 'clsx';

import { LinearProgress } from '../layout';
import { Link } from '../Link';
import type { FieldProps } from './types';
import { visuallyHidden } from '@mui/utils';
import { Offline } from '../Offline';

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
 * @example // using a render prop to render the record
 * <ReferenceField label="User" source="userId" reference="users" render={
 *     (context) => (
 *         <p>{context.referenceRecord?.name}</p>
 *     )
 * }>
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
export const ReferenceField = <
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    inProps: ReferenceFieldProps<RecordType, ReferenceRecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children,
        render,
        emptyText,
        empty,
        offline = defaultOffline,
        ...rest
    } = props;
    const translate = useTranslate();

    return (
        <ReferenceFieldBase<ReferenceRecordType>
            {...rest}
            empty={
                emptyText ? (
                    <Typography component="span" variant="body2">
                        {emptyText && translate(emptyText, { _: emptyText })}
                    </Typography>
                ) : typeof empty === 'string' ? (
                    <Typography component="span" variant="body2">
                        {empty && translate(empty, { _: empty })}
                    </Typography>
                ) : (
                    empty ?? null
                )
            }
            offline={offline}
        >
            <PureReferenceFieldView<RecordType, ReferenceRecordType>
                {...rest}
                render={render}
            >
                {children}
            </PureReferenceFieldView>
        </ReferenceFieldBase>
    );
};

const defaultOffline = <Offline variant="inline" />;

export interface ReferenceFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends FieldProps<RecordType> {
    children?: ReactNode;
    render?: (
        context: UseReferenceFieldControllerResult<ReferenceRecordType>
    ) => ReactNode;
    /**
     * @deprecated Use the empty prop instead
     */
    emptyText?: string;
    empty?: ReactNode;
    queryOptions?: Omit<
        UseQueryOptions<ReferenceRecordType[], Error>,
        'queryFn' | 'queryKey'
    >;
    reference: string;
    translateChoice?: Function | boolean;
    link?: LinkToType<ReferenceRecordType>;
    offline?: ReactNode;
    sx?: SxProps<Theme>;
}

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

export const ReferenceFieldView = <
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceFieldViewProps<RecordType, ReferenceRecordType>
) => {
    const { children, render, className, emptyText, reference, sx, ...rest } =
        useThemeProps({
            props: props,
            name: PREFIX,
        });
    const referenceFieldContext = useReferenceFieldContext();
    const { error, link, isLoading, referenceRecord } = referenceFieldContext;

    const getRecordRepresentation = useGetRecordRepresentation(reference);

    if (error && referenceRecord == null) {
        return (
            <div>
                <ErrorIcon role="presentation" color="error" fontSize="small" />
                <span style={visuallyHidden}>
                    {typeof error === 'string' ? error : error?.message}
                </span>
            </div>
        );
    }
    // We explicitly check isLoading here as the record may not have an id for the reference,
    // in which case, the query will not be enabled and isPending will be true
    // isLoading checks that we are actually loading the reference record
    if (isLoading) {
        return <LinearProgress />;
    }

    const child = (render ? render(referenceFieldContext) : children) || (
        <Typography component="span" variant="body2">
            {getRecordRepresentation(referenceRecord)}
        </Typography>
    );

    if (link) {
        return (
            <Root
                className={clsx(ReferenceFieldClasses.root, className)}
                sx={sx}
                {...rest}
            >
                <Link
                    to={link}
                    className={ReferenceFieldClasses.link}
                    onClick={stopPropagation}
                    state={{ _scrollToTop: true }}
                >
                    {child}
                </Link>
            </Root>
        );
    }

    return (
        <Root
            className={clsx(ReferenceFieldClasses.root, className)}
            sx={sx}
            {...rest}
        >
            {child}
        </Root>
    );
};

export interface ReferenceFieldViewProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends FieldProps<RecordType>,
        Omit<ReferenceFieldProps<RecordType, ReferenceRecordType>, 'link'> {
    children?: ReactNode;
    render?: (
        context: UseReferenceFieldControllerResult<RaRecord>
    ) => ReactNode;
    reference: string;
    resource?: string;
    translateChoice?: Function | boolean;
    sx?: SxProps<Theme>;
}

const PureReferenceFieldView = genericMemo(ReferenceFieldView);

const PREFIX = 'RaReferenceField';

export const ReferenceFieldClasses = {
    root: `${PREFIX}-root`,
    link: `${PREFIX}-link`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => ({
        ['&']: styles.root,
        [`& .${ReferenceFieldClasses.link}`]: styles.link,
    }),
})(({ theme }) => ({
    lineHeight: 'initial',
    [`& .${ReferenceFieldClasses.link}`]: {
        '& > *': {
            color: (theme.vars || theme).palette.primary.main,
        },
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaReferenceField: 'root' | 'link';
    }

    interface ComponentsPropsList {
        RaReferenceField: Partial<ReferenceFieldProps>;
    }

    interface Components {
        RaReferenceField?: {
            defaultProps?: ComponentsPropsList['RaReferenceField'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaReferenceField'];
        };
    }
}
