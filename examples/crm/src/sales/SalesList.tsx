import { Chip, Stack } from '@mui/material';
import {
    CreateButton,
    DataTable,
    ExportButton,
    List,
    SearchInput,
    TopToolbar,
    useRecordContext,
} from 'react-admin';

const SalesListActions = () => (
    <TopToolbar>
        <ExportButton />
        <CreateButton variant="contained" label="New user" />
    </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

const OptionsField = (_props: { label?: string | boolean }) => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Stack direction="row" gap={1}>
            {record.administrator && (
                <Chip
                    label="Admin"
                    size="small"
                    variant="outlined"
                    color="primary"
                />
            )}
            {record.disabled && (
                <Chip
                    label="Disabled"
                    size="small"
                    variant="outlined"
                    color="warning"
                />
            )}
        </Stack>
    );
};

export const SalesList = () => (
    <Stack gap={4}>
        <List
            filters={filters}
            actions={<SalesListActions />}
            sort={{ field: 'first_name', order: 'ASC' }}
        >
            <DataTable rowClick="edit">
                <DataTable.Col
                    source="last_name"
                    label="Name"
                    render={record =>
                        `${record.first_name} ${record.last_name}`
                    }
                />
                <DataTable.Col source="email" />
                <DataTable.Col field={OptionsField} />
            </DataTable>
        </List>
    </Stack>
);
