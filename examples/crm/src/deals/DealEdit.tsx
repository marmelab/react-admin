import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    DeleteWithConfirmButton,
    EditBase,
    Form,
    SaveButton,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { Deal } from '../types';
import { DealInputs } from './DealInputs';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect('/deals');
    };

    if (id == null) {
        return null;
    }

    return (
        <EditBase id={id} redirect="show">
            <Form>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="lg"
                    scroll="paper"
                    sx={{
                        '& form': {
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            flexBasis: '100%',
                        },
                    }}
                    disablePortal
                >
                    <EditHeader />
                    <DialogContent
                        sx={{
                            scrollbarGutter: 'stable',
                            paddingInlineEnd: 1.5,
                        }}
                    >
                        <DealInputs />
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBlock: 1,
                            paddingInline: 3,
                        }}
                    >
                        <SaveButton />
                        <DeleteWithConfirmButton />
                    </DialogActions>
                </Dialog>
            </Form>
        </EditBase>
    );
};

function EditHeader() {
    const deal = useRecordContext<Deal>();
    if (!deal) {
        return null;
    }

    return (
        <DialogTitle>
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
