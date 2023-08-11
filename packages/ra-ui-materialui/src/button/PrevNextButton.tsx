import * as React from 'react';
import {
    useCreatePath,
    useGetList,
    useGetRecordId,
    useListParams,
    useResourceContext,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

export const PrevNextButton = (props: PrevNextButtonProps) => {
    const { linkType = 'edit' } = props;
    const recordId = useGetRecordId();
    const resource = useResourceContext();
    const createPath = useCreatePath();
    const [query] = useListParams({
        resource,
    });
    const list = useGetList(resource, {
        pagination: { page: query.page, perPage: query.perPage },
        sort: { field: query.sort, order: query.order },
        filter: { ...query.filter },
    });

    if (list.isLoading) {
        return null;
    }

    if (!recordId) return null;

    const ids = list ? list.data.map(record => record.id) : [];
    const total = ids.length;

    const index = ids.indexOf(recordId);
    const previousId = index > 0 ? ids[index - 1] : null;
    const nextId =
        index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

    const previousLink = createPath({
        type: linkType,
        resource,
        id: previousId,
    });

    const nextLink = createPath({
        type: linkType,
        resource,
        id: nextId,
    });

    return (
        <>
            <IconButton
                disabled={!previousId}
                aria-label="previous"
                component={Link}
                to={previousLink}
            >
                <NavigateBefore />
            </IconButton>
            {index + 1} / {total}
            <IconButton
                disabled={!nextId}
                aria-label="next"
                component={Link}
                to={nextLink}
            >
                <NavigateNext />
            </IconButton>
        </>
    );
};

export interface PrevNextButtonProps {
    linkType?: 'edit' | 'show';
}
