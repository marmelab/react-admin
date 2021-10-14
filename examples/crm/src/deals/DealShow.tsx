import * as React from 'react';
import {
    ShowBase,
    TextField,
    ReferenceField,
    ReferenceManyField,
    ReferenceArrayField,
    useRecordContext,
    useRedirect,
    Identifier,
} from 'react-admin';
import {
    Box,
    Dialog,
    DialogContent,
    Typography,
    Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { NotesIterator } from '../notes';
import { ContactList } from './ContactList';
import { stageNames } from './stages';

const useStyles = makeStyles({
    dialog: {
        position: 'absolute',
        top: 50,
    },
});

export const DealShow = ({ open, id }: { open: boolean; id: Identifier }) => {
    const redirect = useRedirect();
    const classes = useStyles();

    const handleClose = () => {
        redirect('/deals');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            classes={{ paper: classes.dialog }}
        >
            <DialogContent>
                <ShowBase resource="deals" basePath="/deals" id={id}>
                    <DealShowContent />
                </ShowBase>
            </DialogContent>
        </Dialog>
    );
};

const DealShowContent = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <>
            <Box display="flex">
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
                    <Typography variant="h5">{record.name}</Typography>

                    <Box display="flex" mt={2}>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Start
                            </Typography>
                            <Typography variant="subtitle1">
                                {format(new Date(record.start_at), 'PP')}
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
                                Type
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.type}
                            </Typography>
                        </Box>

                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Stage
                            </Typography>
                            <Typography variant="subtitle1">
                                {/* @ts-ignore */}
                                {stageNames[record.stage]}
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
        </>
    );
};
