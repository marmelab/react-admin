import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import {
    CreateBase,
    DateInput,
    Form,
    RecordRepresentation,
    SaveButton,
    SelectInput,
    TextInput,
    Toolbar,
    required,
    useRecordContext,
} from 'react-admin';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { DialogCloseButton } from '../misc/DialogCloseButton';

export const AddTask = () => {
    const { taskTypes } = useConfigurationContext();
    const contact = useRecordContext();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <>
            <Box mt={1}>
                <Chip
                    icon={<ControlPointIcon />}
                    size="small"
                    variant="outlined"
                    onClick={handleOpen}
                    label="Add task"
                    color="primary"
                />
            </Box>
            <CreateBase
                resource="tasks"
                record={{
                    type: 'None',
                    contact_id: contact?.id,
                    due_date: new Date().toISOString().slice(0, 10),
                }}
                mutationOptions={{ onSuccess: () => setOpen(false) }}
            >
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    disableRestoreFocus
                    maxWidth="sm"
                >
                    <Form>
                        <DialogCloseButton onClose={() => setOpen(false)} />
                        <DialogTitle id="form-dialog-title">
                            Create a new task for{' '}
                            <RecordRepresentation
                                record={contact}
                                resource="contacts"
                            />
                        </DialogTitle>
                        <DialogContent>
                            <TextInput
                                autoFocus
                                source="text"
                                label="Description"
                                validate={required()}
                                multiline
                                helperText={false}
                            />
                            <Stack direction="row" spacing={1} mt={2}>
                                <DateInput
                                    source="due_date"
                                    validate={required()}
                                    helperText={false}
                                />
                                <SelectInput
                                    source="type"
                                    validate={required()}
                                    choices={taskTypes.map(type => ({
                                        id: type,
                                        name: type,
                                    }))}
                                    helperText={false}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 0 }}>
                            <Toolbar
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <SaveButton onClick={() => setOpen(false)} />
                            </Toolbar>
                        </DialogActions>
                    </Form>
                </Dialog>
            </CreateBase>
        </>
    );
};
