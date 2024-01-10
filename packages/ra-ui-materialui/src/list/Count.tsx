import * as React from 'react';
import {
    useResourceContext,
    useGetList,
    useTimeout,
    useCreatePath,
    SortPayload,
} from 'ra-core';
import { Typography, TypographyProps, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import { Link } from '../Link';

/**
 * Fetch and render the number of records of a given resource
 *
 * Relies on dataProvider.getList() returning a total property
 *
 * @example // Display the number of records in the current resource (based on ResourceContext)
 * <Count />
 *
 * @example // Display the number of posts
 * <Count resource="posts" />
 *
 * @example // Display the number of published posts
 * <Count resource="posts" filter={{ is_published: true }}/>
 *
 * @example // Display the number of posts, with a custom Typography variant
 * <Count resource="posts" variant="h1" />
 *
 * @see ReferenceManyCount for a similar component which fetches the number of records related to the current one
 */
export const Count = (props: CountProps) => {
    const {
        filter,
        sort,
        link,
        resource: resourceFromProps,
        timeout = 1000,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const oneSecondHasPassed = useTimeout(timeout);
    const createPath = useCreatePath();

    const { total, isLoading, error } = useGetList(resource, {
        filter,
        sort,
        pagination: { perPage: 1, page: 1 },
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
        // @ts-ignore TypeScript complains that the props for <a> aren't the same as for <span>
        <Link
            to={{
                pathname: createPath({ resource, type: 'list' }),
                search: filter ? `filter=${JSON.stringify(filter)}` : undefined,
            }}
            variant="body2"
            onClick={e => e.stopPropagation()}
            {...rest}
        >
            {body}
        </Link>
    ) : (
        <Typography component="span" variant="body2" {...rest}>
            {body}
        </Typography>
    );
};

export interface CountProps extends TypographyProps {
    filter?: any;
    sort?: SortPayload;
    link?: Boolean;
    resource?: string;
    timeout?: number;
}
