import * as React from 'react';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Typography, SxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import {
    LinkToType,
    RecordContextProvider,
    useGetRecordRepresentation,
    useTranslate,
    RaRecord,
    ReferenceFieldBase,
    useReferenceFieldContext,
} from 'ra-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { LinearProgress } from '../layout';
import { Link } from '../Link';
import { FieldProps, fieldPropTypes } from './types';
import { genericMemo } from './genericMemo';

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
export const ReferenceField = <
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: ReferenceFieldProps<RecordType, ReferenceRecordType>
) => {
    const { link, ...rest } = props;
    return (
        <ReferenceFieldBase {...props}>
            <PureReferenceFieldView<RecordType, ReferenceRecordType>
                {...rest}
            />
        </ReferenceFieldBase>
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
    ]),
};

export interface ReferenceFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord
> extends Omit<FieldProps<RecordType>, 'source'>,
        Required<Pick<FieldProps<RecordType>, 'source'>> {
    children?: ReactNode;
    queryOptions?: Partial<
        UseQueryOptions<ReferenceRecordType[], Error> & {
            meta?: any;
        }
    >;
    reference: string;
    translateChoice?: Function | boolean;
    link?: LinkToType<ReferenceRecordType>;
    sx?: SxProps;
}

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

export const ReferenceFieldView = <
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: ReferenceFieldViewProps<RecordType, ReferenceRecordType>
) => {
    const { children, className, emptyText, reference, sx } = props;
    const {
        error,
        link,
        isLoading,
        referenceRecord,
    } = useReferenceFieldContext();

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
    // We explicitly check isLoading here as the record may not have an id for the reference,
    // in which case, the query will not be enabled and isPending will be true
    // isLoading checks that we are actually loading the reference record
    if (isLoading) {
        return <LinearProgress />;
    }
    if (!referenceRecord) {
        return emptyText ? (
            <Typography component="span" variant="body2">
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null;
    }

    let child = children || (
        <Typography component="span" variant="body2">
            {getRecordRepresentation(referenceRecord)}
        </Typography>
    );

    if (link) {
        return (
            <Root className={className} sx={sx}>
                <RecordContextProvider value={referenceRecord}>
                    <Link
                        to={link}
                        className={ReferenceFieldClasses.link}
                        onClick={stopPropagation}
                        state={{ _scrollToTop: true }}
                    >
                        {child}
                    </Link>
                </RecordContextProvider>
            </Root>
        );
    }

    return (
        <Root className={className} sx={sx}>
            <RecordContextProvider value={referenceRecord}>
                {child}
            </RecordContextProvider>
        </Root>
    );
};

export interface ReferenceFieldViewProps<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends RaRecord = RaRecord
> extends FieldProps<RecordType>,
        Omit<ReferenceFieldProps<RecordType, ReferenceRecordType>, 'link'> {
    children?: ReactNode;
    reference: string;
    resource?: string;
    translateChoice?: Function | boolean;
    sx?: SxProps;
}

ReferenceFieldView.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    record: PropTypes.any,
    reference: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

const PureReferenceFieldView = genericMemo(ReferenceFieldView);

const PREFIX = 'RaReferenceField';

export const ReferenceFieldClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    lineHeight: 'initial',
    [`& .${ReferenceFieldClasses.link}`]: {
        '& > *': {
            color: theme.palette.primary.main,
        },
    },
}));
