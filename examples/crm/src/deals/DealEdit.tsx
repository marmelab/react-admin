import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
    DeleteWithConfirmButton,
    EditBase,
    Form,
    SaveButton,
    Toolbar,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { DealInputs } from './DealInputs';
import { DialogContent } from '@mui/material';
import { DialogCloseButton } from '../misc/DialogCloseButton';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect('/deals', undefined, undefined, undefined, {
            _scrollToTop: false,
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <EditBase id={id} redirect="show">
                    <DialogCloseButton onClose={handleClose} />
                    <EditHeader />
                    <Form>
                        <DialogContent>
                            <DealInputs />
                        </DialogContent>
                        <EditToolbar />
                    </Form>
                </EditBase>
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
        <DialogTitle>
            Edit{' '}
            <Typography
                fontWeight={700}
                variant="h6"
                component={Link}
                to={`/deals/${deal.id}/show`}
            >
                {deal.name}
            </Typography>{' '}
            deal
        </DialogTitle>
    );
}

function EditToolbar() {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />
            <DeleteWithConfirmButton />
        </Toolbar>
    );
}
