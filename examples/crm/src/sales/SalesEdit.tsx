import {
    DeleteWithConfirmButton,
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { SalesInputs } from './SalesInputs';
import { Container, Typography } from '@mui/material';

function EditToolbar() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />

            <DeleteWithConfirmButton
                disabled={record?.id === identity?.id}
                mutationOptions={{
                    meta: {
                        identity,
                    },
                }}
            />
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
