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
import { hasOtherFiltersThanDefault } from '../misc/hasOtherFiltersThanDefault';
import { DealEdit } from './DealEdit';
import { DealArchivedList } from './DealArchivedList';

const DealList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;
    return (
        <ListBase
            perPage={100}
            filterDefaultValues={{
                sales_id: identity?.id,
                archived_at_eq: null,
            }}
            sort={{ field: 'updated_at', order: 'DESC' }}
        >
            <DealLayout />
        </ListBase>
    );
};

const DealLayout = () => {
    const location = useLocation();
    const matchCreate = matchPath('/deals/create', location.pathname);
    const matchShow = matchPath('/deals/:id/show', location.pathname);
    const matchEdit = matchPath('/deals/:id', location.pathname);

    const { data, isPending, filterValues } = useListContext();
    const { identity } = useGetIdentity();
    const hasOtherFiltersThanDefaultBoolean = hasOtherFiltersThanDefault(
        filterValues,
        'sales_id',
        identity?.id
    );

    if (isPending) return <LinearProgress />;
    if (!data?.length && !hasOtherFiltersThanDefaultBoolean)
        return <DealEmpty />;

    return (
        <Stack component="div" sx={{ width: '100%' }}>
            <Title title={'Deals'} />
            <ListToolbar filters={dealFilters} actions={<DealActions />} />
            <Card>
                <DealListContent />
            </Card>
            <DealArchivedList />
            <DealCreate open={!!matchCreate} />
            <DealEdit
                open={!!matchEdit && !matchCreate}
                id={matchEdit?.params.id}
            />
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
