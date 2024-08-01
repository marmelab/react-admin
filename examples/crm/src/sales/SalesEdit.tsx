import {
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
    useNotify,
    useRecordContext,
    useRedirect,
    useUpdate,
} from 'react-admin';
import { Sale } from '../types';
import { SalesInputs } from './SalesInputs';
import { Button, Container, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function EditToolbar() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />

            <SaleDeleteButton disabled={record?.id === identity?.id} />
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

const SaleDeleteButton = ({ disabled }: { disabled?: boolean }) => {
    const [update] = useUpdate();
    const record = useRecordContext();
    const notify = useNotify();
    const redirect = useRedirect();
    if (!record || record.deleted_at) return null;

    const handleDelete = () => {
        update(
            'sales',
            {
                id: record.id,
                data: { deleted_at: new Date().toISOString() },
                previousData: record,
            },

            {
                mutationMode: 'undoable',
                onSuccess: () => {
                    notify('Element deleted', {
                        undoable: true,
                    });
                    redirect('list', 'sales');
                },
                onError: error =>
                    notify(`Error: ${error.message}`, { type: 'error' }),
            }
        );
    };

    return (
        <Button
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
            color="error"
            size="small"
            disabled={disabled}
        >
            Delete
        </Button>
    );
};
