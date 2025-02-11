import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from '@mui/material';
import {
    DeleteButton,
    EditBase,
    Form,
    ReferenceField,
    SaveButton,
    Toolbar,
    useNotify,
    useRecordContext,
    useRedirect,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { Deal } from '../types';
import { DealInputs } from './DealInputs';
import { CompanyAvatar } from '../companies/CompanyAvatar';

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();
    const notify = useNotify();

    const handleClose = () => {
        redirect('/deals', undefined, undefined, undefined, {
            _scrollToTop: false,
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'flex-start',
                },
            }}
        >
            {!!id ? (
                <EditBase
                    id={id}
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: () => {
                            notify('Deal updated');
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
                <Stack direction="row" alignItems="center" gap={2}>
                    <ReferenceField
                        source="company_id"
                        reference="companies"
                        link="show"
                    >
                        <CompanyAvatar />
                    </ReferenceField>
                    <Typography variant="h6">Edit {deal.name} deal</Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ pr: 3 }}>
                    <Button
                        component={Link}
                        to={`/deals/${deal.id}/show`}
                        size="small"
                    >
                        Back to deal
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
            <DeleteButton mutationMode="undoable" />
        </Toolbar>
    );
}
