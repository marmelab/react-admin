import * as React from 'react';
import { SimpleForm, useRedirect, Edit } from 'react-admin';
import { Dialog } from '@mui/material';
import { DealForm } from './DealForm';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect('/deals');
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <Edit
                    id={id}
                    redirect="list"
                    sx={{ '& .RaCreate-main': { mt: 0 } }}
                >
                    <SimpleForm>
                        <DealForm />
                    </SimpleForm>
                </Edit>
            ) : null}
        </Dialog>
    );
};
