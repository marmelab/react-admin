import * as React from 'react';
import {
    useCreatePath,
    useGetList,
    useGetRecordId,
    useListParams,
    useResourceContext,
    useTranslate,
} from 'ra-core';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IconButton, SxProps, styled } from '@mui/material';

export const PrevNextButton = (props: PrevNextButtonProps) => {
    const { linkType = 'edit', sx } = props;
    const translate = useTranslate();
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
        <PrevNextButtonRoot sx={sx}>
            <PrevNextButtonUl>
                <li>
                    <IconButton
                        disabled={!previousId}
                        aria-label={translate('ra.navigation.previous')}
                        component={Link}
                        to={previousLink}
                    >
                        <NavigateBefore />
                    </IconButton>
                </li>
                <li>
                    {index + 1} / {total}
                </li>
                <li>
                    <IconButton
                        disabled={!nextId}
                        aria-label={translate('ra.navigation.next')}
                        component={Link}
                        to={nextLink}
                    >
                        <NavigateNext />
                    </IconButton>
                </li>
            </PrevNextButtonUl>
        </PrevNextButtonRoot>
    );
};

export interface PrevNextButtonProps {
    linkType?: 'edit' | 'show';
    sx?: SxProps;
}

const PREFIX = 'RaPrevNextButton';

const PrevNextButtonRoot = styled('nav', {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (_props, styles) => styles.root,
})({});

const PrevNextButtonUl = styled('ul', {
    name: PREFIX,
    slot: 'Ul',
    overridesResolver: (_props, styles) => styles.ul,
})({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    listStyle: 'none',
});
