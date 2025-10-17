import React from 'react';
import {
    useRecordContext,
    useCreatePath,
    ReferenceManyCountBase,
    RaRecord,
    ReferenceManyCountBaseProps,
} from 'ra-core';
import clsx from 'clsx';
import { Typography, TypographyProps, CircularProgress } from '@mui/material';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import get from 'lodash/get.js';

import { FieldProps } from './types';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Link } from '../Link';
import { Offline } from '../Offline';

/**
 * Fetch and render the number of records related to the current one
 *
 * Relies on dataProvider.getManyReference() returning a total property
 *
 * @example // Display the number of comments for the current post
 * <ReferenceManyCount reference="comments" target="post_id" />
 *
 * @example // Display the number of published comments for the current post
 * <ReferenceManyCount reference="comments" target="post_id" filter={{ is_published: true }} />
 *
 * @example // Display the number of comments for the current post, with a custom Typography variant
 * <ReferenceManyCount reference="comments" target="post_id" variant="h1" />
 */
export const ReferenceManyCount = <RecordType extends RaRecord = RaRecord>(
    inProps: ReferenceManyCountProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        className,
        reference,
        target,
        filter,
        sort,
        link,
        resource,
        source = 'id',
        offline = defaultOffline,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const createPath = useCreatePath();

    const body = (
        <ReferenceManyCountBase
            {...props}
            loading={<CircularProgress size={14} />}
            error={
                <ErrorIcon color="error" fontSize="small" titleAccess="error" />
            }
            offline={offline}
        />
    );
    return (
        <StyledTypography
            className={clsx(className, ReferenceManyCountClasses.root)}
            component="span"
            variant="body2"
            {...sanitizeFieldRestProps(rest)}
        >
            {link && record ? (
                <Link
                    className={ReferenceManyCountClasses.link}
                    to={{
                        pathname: createPath({
                            resource: reference,
                            type: 'list',
                        }),
                        search: `filter=${JSON.stringify({
                            ...(filter || {}),
                            [target]: get(record, source),
                        })}`,
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {body}
                </Link>
            ) : (
                body
            )}
        </StyledTypography>
    );
};

// This is a hack that replaces react support for defaultProps. We currently need this for the Datagrid.
ReferenceManyCount.textAlign = 'right';
const defaultOffline = <Offline variant="inline" />;

export interface ReferenceManyCountProps<RecordType extends RaRecord = RaRecord>
    extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<ReferenceManyCountBaseProps, 'record'>,
        Omit<TypographyProps, 'textAlign'> {
    link?: boolean;
}

const PREFIX = 'RaReferenceManyCount';

export const ReferenceManyCountClasses = {
    root: `${PREFIX}-root`,
    link: `${PREFIX}-link`,
};

const StyledTypography = styled(Typography, {
    name: PREFIX,
    overridesResolver: (props, styles) => ({
        ['&']: styles.root,
        [`& .${ReferenceManyCountClasses.link}`]: styles.link,
    }),
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root' | 'link';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<ReferenceManyCountProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
