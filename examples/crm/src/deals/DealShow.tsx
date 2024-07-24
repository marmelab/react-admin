import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import {
    DeleteButton,
    EditButton,
    ReferenceArrayField,
    ReferenceField,
    ReferenceManyField,
    ShowBase,
    TextField,
    useNotify,
    useRecordContext,
    useRedirect,
    useRefresh,
    useUpdate,
} from 'react-admin';

import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { CompanyAvatar } from '../companies/CompanyAvatar';
import { NotesIterator } from '../notes';
import { Deal } from '../types';
import { ContactList } from './ContactList';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { findDealLabel } from './deal';

export const DealShow = ({ open, id }: { open: boolean; id?: string }) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect('list', 'deals');
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogContent sx={{ padding: 0 }}>
                {!!id ? (
                    <ShowBase id={id}>
                        <DealShowContent />
                    </ShowBase>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

const DealShowContent = () => {
    const { dealStages } = useConfigurationContext();
    const record = useRecordContext<Deal>();
    if (!record) return null;
    return (
        <Stack gap={1}>
            {record.archived_at ? <ArchivedTitle /> : null}
            <Box display="flex" p={3}>
                <Box
                    width={100}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <ReferenceField
                        source="company_id"
                        reference="companies"
                        link="show"
                    >
                        <CompanyAvatar />
                    </ReferenceField>
                    <ReferenceField
                        source="company_id"
                        reference="companies"
                        link="show"
                    >
                        <TextField
                            source="name"
                            align="center"
                            component="div"
                        />
                    </ReferenceField>
                </Box>
                <Box ml={2} flex="1">
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h5">{record.name}</Typography>
                        <Stack gap={1} direction="row">
                            {record.archived_at ? (
                                <>
                                    <UnarchiveButton record={record} />
                                    <DeleteButton />
                                </>
                            ) : (
                                <>
                                    <ArchiveButton record={record} />
                                    <EditButton />
                                </>
                            )}
                        </Stack>
                    </Stack>

                    <Box display="flex" mt={2}>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Starting date
                            </Typography>
                            <Typography variant="subtitle1">
                                {format(record.start_at, 'PP')}
                            </Typography>
                        </Box>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Expecting closing date
                            </Typography>
                            <Typography variant="subtitle1">
                                {format(record.expecting_closing_date, 'PP')}
                            </Typography>
                        </Box>

                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Budget
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.amount.toLocaleString('en-US', {
                                    notation: 'compact',
                                    style: 'currency',
                                    currency: 'USD',
                                    currencyDisplay: 'narrowSymbol',
                                    minimumSignificantDigits: 3,
                                })}
                            </Typography>
                        </Box>

                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Category
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.category}
                            </Typography>
                        </Box>

                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Stage
                            </Typography>
                            <Typography variant="subtitle1">
                                {findDealLabel(dealStages, record.stage)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box mt={2} mb={2}>
                        <Box
                            display="flex"
                            mr={5}
                            flexDirection="column"
                            minHeight={48}
                        >
                            <Typography color="textSecondary" variant="body2">
                                Contacts
                            </Typography>
                            <ReferenceArrayField
                                source="contact_ids"
                                reference="contacts"
                            >
                                <ContactList />
                            </ReferenceArrayField>
                        </Box>
                    </Box>

                    <Box mt={2} mb={2} style={{ whiteSpace: 'pre-line' }}>
                        <Typography color="textSecondary" variant="body2">
                            Description
                        </Typography>
                        <Typography>{record.description}</Typography>
                    </Box>

                    <Divider />

                    <Box mt={2}>
                        <ReferenceManyField
                            target="deal_id"
                            reference="dealNotes"
                            sort={{ field: 'date', order: 'DESC' }}
                        >
                            <NotesIterator reference="deals" />
                        </ReferenceManyField>
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
};

const ArchivedTitle = () => (
    <Box
        sx={{
            background: theme => theme.palette.warning.main,
            px: 3,
            py: 2,
        }}
    >
        <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
                color: theme => theme.palette.warning.contrastText,
            }}
        >
            Archived Deal
        </Typography>
    </Box>
);

const ArchiveButton = ({ record }: { record: Deal }) => {
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();
    const handleClick = () => {
        update(
            'deals',
            {
                id: record.id,
                data: { archived_at: new Date().toISOString() },
                previousData: record,
            },
            {
                onSuccess: () => {
                    redirect('list', 'deals');
                    notify('Deal archived', { type: 'info', undoable: false });
                    refresh();
                },
                onError: () => {
                    notify('Error: deal not archived', { type: 'error' });
                },
            }
        );
    };

    return (
        <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<ArchiveIcon />}
        >
            Archive
        </Button>
    );
};

const UnarchiveButton = ({ record }: { record: Deal }) => {
    const [update] = useUpdate();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();
    const handleClick = () => {
        update(
            'deals',
            {
                id: record.id,
                data: {
                    archived_at: null,
                    updated_at: new Date().toISOString(),
                },
                previousData: record,
            },
            {
                onSuccess: () => {
                    redirect('list', 'deals');
                    notify('Deal unarchived', {
                        type: 'info',
                        undoable: false,
                    });
                    refresh();
                },
                onError: () => {
                    notify('Error: deal not unarchived', { type: 'error' });
                },
            }
        );
    };

    return (
        <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<UnarchiveIcon />}
        >
            Send back to the board
        </Button>
    );
};
