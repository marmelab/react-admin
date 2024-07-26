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

import { Card, LinearProgress, Stack } from '@mui/material';
import { hasOtherFiltersThanDefault } from '../misc/hasOtherFiltersThanDefault';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { DealArchivedList } from './DealArchivedList';
import { DealCreate } from './DealCreate';
import { DealEdit } from './DealEdit';
import { DealEmpty } from './DealEmpty';
import { DealListContent } from './DealListContent';
import { DealShow } from './DealShow';
import { OnlyMineInput } from './OnlyMineInput';

const DealList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;
    return (
        <ListBase
            perPage={100}
            filterDefaultValues={{
                sales_id: identity?.id,
            }}
            filter={{
                archived_at_eq: null,
            }}
            sort={{ field: 'index', order: 'DESC' }}
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

    const { dealCategories } = useConfigurationContext();

    const dealFilters = [
        <SearchInput source="q" alwaysOn />,
        <ReferenceInput source="company_id" reference="companies" />,
        <SelectInput
            source="category"
            label="Category"
            choices={dealCategories.map(type => ({ id: type, name: type }))}
        />,
        <OnlyMineInput source="sales_id" alwaysOn />,
    ];

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
