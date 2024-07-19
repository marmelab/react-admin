import * as React from 'react';
import { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from '@mui/material';
import {
    RecordRepresentation,
    CreateBase,
    Form,
    TextInput,
    DateInput,
    SaveButton,
    SelectInput,
    Toolbar,
    required,
    useRecordContext,
} from 'react-admin';
import { taskTypes } from './task.const';

export const AddTask = () => {
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
                            />
                            <Stack direction="row" spacing={1} mt={2}>
                                <DateInput
                                    source="due_date"
                                    validate={required()}
                                />
                                <SelectInput
                                    source="type"
                                    validate={required()}
                                    choices={taskTypes.map(type => ({
                                        id: type,
                                        name: type,
                                    }))}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 0 }}>
                            <Toolbar
                                sx={{
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                }}
                            >
                                <Button onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <SaveButton onClick={() => setOpen(false)} />
                            </Toolbar>
                        </DialogActions>
                    </Form>
                </Dialog>
            </CreateBase>
        </>
    );
};
