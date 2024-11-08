import { Chip, Stack } from '@mui/material';
import {
    CreateButton,
    DatagridConfigurable,
    ExportButton,
    List,
    SearchInput,
    TextField,
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
                    <OptionsField label={false} />
                </DatagridConfigurable>
            </List>
        </Stack>
    );
}
