import React from 'react';
import {
    useReferenceManyFieldController,
    useRecordContext,
    useTimeout,
    useCreatePath,
    SortPayload,
} from 'ra-core';
import { Typography, TypographyProps, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { Call, Objects } from 'hotscript';

import { PublicFieldProps, InjectedFieldProps } from './types';
import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { Link } from '../Link';
import { get } from 'lodash';

/**
 * Fetch and render the number of records related to the current one
 *
 * Relies on dataProvider.getManyReference() returning a total property
 *
 * @example // Display the number of comments for the current post
 * <ReferenceManyCount reference="comments" target="post_id">
 *
 * @example // Display the number of published comments for the current post
 * <ReferenceManyCount reference="comments" target="post_id" filter={{ is_published: true }}>
 *
 * @example // Display the number of comments for the current post, with a custom Typography variant
 * <ReferenceManyCount reference="comments" target="post_id" variant="h1">
 */
export const ReferenceManyCount = <
    RecordType extends any = unknown,
    ReferenceType extends any = unknown
>(
    props: ReferenceManyCountProps<RecordType, ReferenceType>
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
    const record = useRecordContext<RecordType>(props);
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

    const targetValue = get(record, source);

    return link ? (
        <Link
            to={{
                pathname: createPath({ resource: reference, type: 'list' }),
                search: `filter=${JSON.stringify({
                    ...(filter || {}),
                    [target]: targetValue,
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

export interface ReferenceManyCountProps<
    RecordType extends any = unknown,
    ReferenceType extends any = unknown
> extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    reference: string;
    target: unknown extends ReferenceType
        ? string
        : Call<Objects.AllPaths, ReferenceType>;
    sort?: SortPayload;
    filter?: any;
    label?: string;
    link?: boolean;
    resource?: string;
    timeout?: number;
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}
