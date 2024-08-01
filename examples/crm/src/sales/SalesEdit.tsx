import {
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { SalesInputs } from './SalesInputs';
import { Container, Typography } from '@mui/material';

function EditToolbar() {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
        </Toolbar>
    );
}

export function SalesEdit() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Edit>
                <SimpleForm toolbar={<EditToolbar />}>
                    <SaleEditTitle />
                    <SalesInputs />
                </SimpleForm>
            </Edit>
        </Container>
    );
}

const SaleEditTitle = () => {
    const record = useRecordContext<Sale>();
    if (!record) return null;
    return (
        <Typography variant="h6">
            Edit {record?.first_name} {record?.last_name}
        </Typography>
    );
};
