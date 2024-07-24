import * as React from 'react';
import {
    TopToolbar,
    ExportButton,
    CreateButton,
    Pagination,
    useGetIdentity,
    ListBase,
    Title,
    ListToolbar,
    useListContext,
} from 'react-admin';

import { ImageList } from './GridList';
import { CompanyListFilter } from './CompanyListFilter';
import { Card, LinearProgress, Stack } from '@mui/material';
import { CompanyEmpty } from './CompanyEmpty';
import { hasOtherFiltersThanDefault } from '../misc/hasOtherFiltersThanDefault';

export const CompanyList = () => {
    const { identity } = useGetIdentity();
    if (!identity) return null;
    return (
        <ListBase
            perPage={25}
            filterDefaultValues={{ sales_id: identity?.id }}
            sort={{ field: 'name', order: 'ASC' }}
        >
            <CompanyListLayout />
        </ListBase>
    );
};

const CompanyListLayout = () => {
    const { data, isPending, filterValues } = useListContext();
    const { identity } = useGetIdentity();
    const hasOtherFiltersThanDefaultBoolean = hasOtherFiltersThanDefault(
        filterValues,
        'sales_id',
        identity?.id
    );
    if (isPending) return <LinearProgress />;
    if (!data?.length && !hasOtherFiltersThanDefaultBoolean)
        return <CompanyEmpty />;

    return (
        <Stack direction="row" component="div">
            <CompanyListFilter />
            <Stack sx={{ width: '100%' }}>
                <Title title={'Companies'} />
                <ListToolbar actions={<CompanyListActions />} />
                <ImageList />
                <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
            </Stack>
        </Stack>
    );
};

const CompanyListActions = () => {
    return (
        <TopToolbar>
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Company"
                sx={{ marginLeft: 2 }}
            />
        </TopToolbar>
    );
};
