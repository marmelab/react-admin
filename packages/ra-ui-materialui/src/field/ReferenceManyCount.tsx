import React from 'react';
import {
    useReferenceManyFieldController,
    useRecordContext,
    useTimeout,
    useCreatePath,
    SortPayload,
    RaRecord,
} from 'ra-core';
import { Typography, TypographyProps, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import { FieldProps } from './types';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Link } from '../Link';

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
    props: ReferenceManyCountProps<RecordType>
) => {
    const {
        reference,
        target,
        filter,
        sort,
        link,
        resource,
        source = 'id',
        timeout = 1000,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const oneSecondHasPassed = useTimeout(timeout);
    const createPath = useCreatePath();

    const { isLoading, error, total } = useReferenceManyFieldController<
        RecordType
    >({
        filter,
        sort,
        page: 1,
        perPage: 1,
        record,
        reference,
        // @ts-ignore remove when #8491 is released
        resource,
        source,
        target,
    });

    const body = isLoading ? (
        oneSecondHasPassed ? (
            <CircularProgress size={14} />
        ) : (
            ''
        )
    ) : error ? (
        <ErrorIcon color="error" fontSize="small" titleAccess="error" />
    ) : (
        total
    );

    return link ? (
        <Link
            to={{
                pathname: createPath({ resource: reference, type: 'list' }),
                search: `filter=${JSON.stringify({
                    ...(filter || {}),
                    [target]: record[source],
                })}`,
            }}
            variant="body2"
            onClick={e => e.stopPropagation()}
            {...sanitizeFieldRestProps(rest)}
        >
            {body}
        </Link>
    ) : (
        <Typography
            component="span"
            variant="body2"
            {...sanitizeFieldRestProps(rest)}
        >
            {body}
        </Typography>
    );
};

export interface ReferenceManyCountProps<RecordType extends RaRecord = RaRecord>
    extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    reference: string;
    target: string;
    sort?: SortPayload;
    filter?: any;
    link?: boolean;
    timeout?: number;
}
