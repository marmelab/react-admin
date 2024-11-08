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
    SortButton,
} from 'react-admin';

import { ImageList } from './GridList';
import { CompanyListFilter } from './CompanyListFilter';
import { Stack } from '@mui/material';
import { CompanyEmpty } from './CompanyEmpty';

export const CompanyList = () => {
    const { identity } = useGetIdentity();
    if (!identity) return null;
    return (
        <ListBase perPage={25} sort={{ field: 'name', order: 'ASC' }}>
            <CompanyListLayout />
        </ListBase>
    );
};

const CompanyListLayout = () => {
    const { data, isPending, filterValues } = useListContext();
    const hasFilters = filterValues && Object.keys(filterValues).length > 0;

    if (isPending) return null;
    if (!data?.length && !hasFilters) return <CompanyEmpty />;

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
            <SortButton fields={['name', 'created_at', 'nb_contacts']} />
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Company"
                sx={{ marginLeft: 2 }}
            />
        </TopToolbar>
    );
};
