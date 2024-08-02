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
} from 'react-admin';

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
