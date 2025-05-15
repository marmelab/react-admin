import React, { ReactNode } from 'react';
import {
    useReferenceManyFieldController,
    useRecordContext,
    useTimeout,
    useCreatePath,
    SortPayload,
    RaRecord,
    Translate,
} from 'ra-core';
import {
    Typography,
    TypographyProps,
    CircularProgress,
    Stack,
} from '@mui/material';
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
        offline,
        resource,
        source = 'id',
        timeout = 1000,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const oneSecondHasPassed = useTimeout(timeout);
    const createPath = useCreatePath();

    const { isPaused, isPending, error, total } =
        useReferenceManyFieldController<RecordType>({
            filter,
            sort,
            page: 1,
            perPage: 1,
            record,
            reference,
            resource,
            source,
            target,
        });

    let body: ReactNode = total;

    if (isPaused && total == null) {
        body = offline ?? (
            <ErrorIcon
                color="error"
                fontSize="small"
                titleAccess="ra.notification.offline"
            />
        );
    }

    if (isPending && !isPaused && oneSecondHasPassed) {
        body = <CircularProgress size={14} />;
    }

    if (error) {
        body = (
            <Stack direction="row" alignItems="center" gap={1}>
                <ErrorIcon role="presentation" color="error" fontSize="small" />
                <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'error.main' }}
                >
                    <Translate i18nKey="ra.notification.http_error">
                        Server communication error
                    </Translate>
                </Typography>
            </Stack>
        );
    }

    return link && record ? (
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

// This is a hack that replaces react support for defaultProps. We currently need this for the Datagrid.
ReferenceManyCount.textAlign = 'right';

export interface ReferenceManyCountProps<RecordType extends RaRecord = RaRecord>
    extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<TypographyProps, 'textAlign'> {
    offline?: ReactNode;
    reference: string;
    source?: string;
    target: string;
    sort?: SortPayload;
    filter?: any;
    link?: boolean;
    timeout?: number;
}
