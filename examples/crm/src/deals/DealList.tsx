import * as React from 'react';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    SearchInput,
    SelectInput,
    TopToolbar,
    useGetIdentity,
} from 'react-admin';
import { matchPath, useLocation } from 'react-router';

import { DealListContent } from './DealListContent';
import { DealCreate } from './DealCreate';
import { DealShow } from './DealShow';
import { OnlyMineInput } from './OnlyMineInput';
import { typeChoices } from './types';

const DealList = () => {
    const { identity } = useGetIdentity();
    const location = useLocation();
    const matchCreate = matchPath('/deals/create', location.pathname);
    const matchShow = matchPath('/deals/:id/show', location.pathname);
    if (!identity) return null;
    return (
        <>
            <List
                perPage={100}
                sort={{ field: 'index', order: 'ASC' }}
                filters={dealFilters}
                filterDefaultValues={{ sales_id: identity && identity?.id }}
                actions={<DealActions />}
                pagination={false}
                component="div"
            >
                <DealListContent />
            </List>
            <DealCreate open={!!matchCreate} />
            <DealShow open={!!matchShow} id={matchShow?.params.id} />
        </>
    );
};

const dealFilters = [
    <SearchInput source="q" alwaysOn />,
    <OnlyMineInput alwaysOn />,
    <SelectInput source="type" choices={typeChoices} />,
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
