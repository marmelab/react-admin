import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Edit, SimpleForm, useRecordContext, useRedirect } from 'react-admin';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { DealInputs } from './DealInputs';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect('/deals');
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <Edit id={id} redirect="show">
                    <EditHeader />
                    <SimpleForm>
                        <DealInputs />
                    </SimpleForm>
                </Edit>
            ) : null}
        </Dialog>
    );
};

function EditHeader() {
    const deal = useRecordContext<Deal>();
    if (!deal) {
        return null;
    }

    return (
        <DialogTitle
            sx={{
                paddingBottom: 0,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
            >
                <Typography component="span" flexGrow={1}>
                    Edit{' '}
                    <Typography component="strong" fontWeight={700}>
                        {deal.name}
                    </Typography>{' '}
                    deal
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button component={Link} to={`/deals/${deal.id}/show`}>
                        Back to show
                    </Button>
                </Stack>
            </Stack>
        </DialogTitle>
    );
}
