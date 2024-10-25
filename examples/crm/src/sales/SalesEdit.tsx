import { Card, Container, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    SaveButton,
    SimpleForm,
    Toolbar,
    useDataProvider,
    useEditController,
    useNotify,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { SubmitHandler } from 'react-hook-form';
import { CrmDataProvider } from '../providers/types';
import { Sale, SalesFormData } from '../types';
import { SalesInputs } from './SalesInputs';

function EditToolbar() {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
        </Toolbar>
    );
}

export function SalesEdit() {
    const { record } = useEditController();

    const dataProvider = useDataProvider<CrmDataProvider>();
    const notify = useNotify();
    const redirect = useRedirect();

    const { mutate } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (data: SalesFormData) => {
            if (!record) {
                throw new Error('Record not found');
            }
            return dataProvider.salesUpdate(record.id, data);
        },
        onSuccess: () => {
            redirect('/sales');
        },
        onError: () => {
            notify('An error occurred. Please try again.');
        },
    });

    const onSubmit: SubmitHandler<SalesFormData> = async data => {
        mutate(data);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card>
                <SimpleForm
                    toolbar={<EditToolbar />}
                    onSubmit={onSubmit as SubmitHandler<any>}
                    record={record}
                >
                    <SaleEditTitle />
                    <SalesInputs />
                </SimpleForm>
            </Card>
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
