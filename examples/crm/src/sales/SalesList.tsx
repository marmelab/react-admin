import Stack from '@mui/material/Stack';
import {
    BooleanField,
    CreateButton,
    DatagridConfigurable,
    DeleteWithConfirmButton,
    EditButton,
    ExportButton,
    List,
    SearchInput,
    TextField,
    TopToolbar,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { TransferAdminRole } from './TransferAdminRole';
import { useIsAdmin } from './useIsAdmin';

function SalesListActions() {
    return (
        <TopToolbar>
            <ExportButton />
            <CreateButton variant="contained" label="New Sale" />
        </TopToolbar>
    );
}

const filters = [<SearchInput source="q" alwaysOn />];

export function SalesList() {
    const isAdmin = useIsAdmin();
    if (!isAdmin) {
        return null;
    }

    return (
        <Stack gap={4}>
            <List
                filters={filters}
                actions={<SalesListActions />}
                sort={{ field: 'first_name', order: 'ASC' }}
            >
                <DatagridConfigurable rowClick="edit">
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                    <TextField source="email" />
                    <BooleanField source="administrator" />
                    <EditButton />
                    <DeleteButton />
                </DatagridConfigurable>
            </List>

            <TransferAdminRole />
        </Stack>
    );
}

function DeleteButton() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();
    if (record?.id === identity?.id) {
        return null;
    }
    return <DeleteWithConfirmButton />;
}
