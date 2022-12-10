import * as React from 'react';
import { useResourceContext, useGetList, useTimeout } from 'ra-core';
import { Typography, TypographyProps, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Fetch and render the number of records of a given resource
 *
 * Relies on dataProvider.getList() returning a total property
 *
 * @example // Display the number of recorfds in the current resource (based on RezsourceContext)
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
        resource: resourceFromProps,
        timeout = 1000,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const oneSecondHasPassed = useTimeout(timeout);

    const { total, isLoading, error } = useGetList(resource, {
        filter,
        pagination: { perPage: 1, page: 1 },
    });

    return (
        <Typography component="span" variant="body2" {...rest}>
            {isLoading ? (
                oneSecondHasPassed ? (
                    <CircularProgress size={14} />
                ) : (
                    ''
                )
            ) : error ? (
                <ErrorIcon color="error" fontSize="small" titleAccess="error" />
            ) : (
                total
            )}
        </Typography>
    );
};

export interface CountProps extends TypographyProps {
    filter?: any;
    resource?: string;
    timeout?: number;
}
