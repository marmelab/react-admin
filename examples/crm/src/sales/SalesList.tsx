import Stack from '@mui/material/Stack';
import {
    BooleanField,
    CreateButton,
    DatagridConfigurable,
    ExportButton,
    List,
    SearchInput,
    TextField,
    TopToolbar,
    usePermissions,
} from 'react-admin';
import { Navigate } from 'react-router';

function SalesListActions() {
    return (
        <TopToolbar>
            <ExportButton />
            <CreateButton variant="contained" label="New user" />
        </TopToolbar>
    );
}

const filters = [<SearchInput source="q" alwaysOn />];

export function SalesList() {
    const { isPending, permissions } = usePermissions();
    if (isPending) {
        return null;
    }

    if (permissions !== 'admin') {
        return <Navigate to="/" />;
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
                    <BooleanField source="administrator" FalseIcon={null} />
                    <BooleanField source="disabled" FalseIcon={null} />
                </DatagridConfigurable>
            </List>
        </Stack>
    );
}
