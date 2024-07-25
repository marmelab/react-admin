import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
    DeleteWithConfirmButton,
    EditBase,
    Form,
    SaveButton,
    Toolbar,
    useNotify,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { DealInputs } from './DealInputs';
import { DialogContent, Stack, Button } from '@mui/material';
import { DialogCloseButton } from '../misc/DialogCloseButton';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();
    const notify = useNotify();

    const handleClose = () => {
        redirect('/deals', undefined, undefined, undefined, {
            _scrollToTop: false,
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <EditBase
                    id={id}
                    mutationOptions={{
                        onSuccess: () => {
                            notify('Deal updated', {
                                undoable: true,
                            });
                            redirect(
                                `/deals/${id}/show`,
                                undefined,
                                undefined,
                                undefined,
                                {
                                    _scrollToTop: false,
                                }
                            );
                        },
                    }}
                >
                    <DialogCloseButton onClose={handleClose} top={13} />
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
                <Typography variant="h6">Edit {deal.name} deal</Typography>

                <Stack direction="row" spacing={1} sx={{ pr: 3 }}>
                    <Button component={Link} to={`/deals/${deal.id}/show`}>
                        Back to show
                    </Button>
                </Stack>
            </Stack>
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
