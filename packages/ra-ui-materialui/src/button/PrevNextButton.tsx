import * as React from 'react';
import {
    FilterPayload,
    ListParams,
    SORT_ASC,
    SortPayload,
    useCreatePath,
    useGetList,
    useRecordContext,
    useResourceContext,
    useStore,
    useTranslate,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IconButton, SxProps, styled } from '@mui/material';
import clsx from 'clsx';

export const PrevNextButton = (props: PrevNextButtonProps) => {
    const {
        linkType = 'edit',
        sx,
        storeKey,
        limit = 1000,
        staleTime = 5 * 60 * 1000,
        sort = { field: 'id', order: SORT_ASC },
        filter = {},
    } = props;

    const translate = useTranslate();
    const record = useRecordContext();
    const resource = useResourceContext();
    const createPath = useCreatePath();
    const [storedParams] = useStore<StoredParams>(
        storeKey || `${resource}.listParams`,
        {
            filter,
            order: sort.order,
            sort: sort.field,
        }
    );

    const { isLoading, data, isError, error } = useGetList(
        resource,
        {
            sort: {
                ...{ field: storedParams.sort, order: storedParams.order },
                ...sort,
            },
            filter: { ...storedParams.filter, ...filter },
            pagination: { page: 1, perPage: limit },
        },
        { staleTime }
    );

    if (!record) return null;
    if (isLoading) return null;
    if (isError) {
        return <>{error.message}</>;
    }

    const ids = data ? data.map(record => record.id) : [];

    const index = ids.indexOf(record.id);

    const previousProps = {
        disabled: true,
        'aria-label': translate('ra.navigation.previous'),
        to: undefined,
        component: undefined,
    };
    const nextProps = {
        disabled: true,
        'aria-label': translate('ra.navigation.next'),
        to: undefined,
        component: undefined,
    };

    if (index !== -1) {
        const previousId =
            typeof ids[index - 1] !== 'undefined' ? ids[index - 1] : null; // could be 0
        const nextId =
            index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

        if (previousId !== null) {
            previousProps.disabled = false;
            previousProps.to = createPath({
                type: linkType,
                resource,
                id: previousId,
            });
            previousProps.component = Link;
        }

        if (nextId !== null) {
            nextProps.disabled = false;
            nextProps.to = createPath({
                type: linkType,
                resource,
                id: nextId,
            });
            nextProps.component = Link;
        }
    }

    return (
        <Root sx={sx}>
            <ul className={clsx(PrevNextButtonClasses.list)}>
                <li>
                    <IconButton {...previousProps}>
                        <NavigateBefore />
                    </IconButton>
                </li>
                {index !== -1 && (
                    <li>
                        {index + 1} / {data.length}
                    </li>
                )}
                <li>
                    <IconButton {...nextProps}>
                        <NavigateNext />
                    </IconButton>
                </li>
            </ul>
        </Root>
    );
};

export interface PrevNextButtonProps {
    linkType?: 'edit' | 'show';
    sx?: SxProps;
    storeKey?: string | false;
    limit?: number;
    staleTime?: number;
    filter?: FilterPayload;
    sort?: SortPayload;
}

const PREFIX = 'RaPrevNextButton';

export const PrevNextButtonClasses = {
    list: `${PREFIX}-list`,
};

const Root = styled('nav', {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})({
    [`& .${PrevNextButtonClasses.list}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        listStyle: 'none',
    },
});

type StoredParams = Pick<ListParams, 'filter' | 'order' | 'sort'>;
