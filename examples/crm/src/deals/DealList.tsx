import * as React from 'react';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    ListBase,
    ListToolbar,
    ReferenceInput,
    SearchInput,
    SelectInput,
    Title,
    TopToolbar,
    useGetIdentity,
    useListContext,
} from 'react-admin';
import { matchPath, useLocation } from 'react-router';

import { DealListContent } from './DealListContent';
import { DealCreate } from './DealCreate';
import { DealShow } from './DealShow';
import { OnlyMineInput } from './OnlyMineInput';
import { typeChoices } from './types';
import { Card, LinearProgress, Stack } from '@mui/material';
import { DealEmpty } from './DealEmpty';

const DealList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;
    return (
        <ListBase
            perPage={100}
            filterDefaultValues={{ sales_id: identity && identity?.id }}
            sort={{ field: 'index', order: 'ASC' }}
        >
            <DealLayout />
        </ListBase>
    );
};

const DealLayout = () => {
    const location = useLocation();
    const matchCreate = matchPath('/deals/create', location.pathname);
    const matchShow = matchPath('/deals/:id/show', location.pathname);

    const { data, isPending } = useListContext();
    if (isPending) return <LinearProgress />;
    if (!data?.length) return <DealEmpty />;

    return (
        <Stack component="div" sx={{ width: '100%' }}>
            <Title title={'Deals'} />
            <ListToolbar filters={dealFilters} actions={<DealActions />} />
            <Card>
                <DealListContent />
                <DealCreate open={!!matchCreate} />
            </Card>
            <DealShow open={!!matchShow} id={matchShow?.params.id} />
        </Stack>
    );
};

const dealFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="company_id" reference="companies" />,
    <SelectInput source="type" label="Category" choices={typeChoices} />,
    <OnlyMineInput source="sales_id" alwaysOn />,
];

const DealActions = () => {
    return (
        <TopToolbar>
            <FilterButton />
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Deal"
                sx={{ marginLeft: 2 }}
            />
        </TopToolbar>
    );
};

export default DealList;
