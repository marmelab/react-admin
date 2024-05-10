import * as React from 'react';
import { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Box,
    Chip,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';
import { RecordRepresentation, useCreate, useRecordContext } from 'react-admin';

const taskTypes = [
    'None',
    'Email',
    'Demo',
    'Lunch',
    'Meeting',
    'Follow-up',
    'Thank you',
    'Ship',
];

export const AddTask = () => {
    const [create, { isPending }] = useCreate();
    const contact = useRecordContext();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        create(
            'tasks',
            { data: { ...formJson, contact_id: contact?.id } },
            {
                onSuccess: () => {
                    setOpen(false);
                },
                onError: error => console.error(error),
            }
        );
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
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <form onSubmit={handleCreateTask}>
                    <DialogTitle id="form-dialog-title">
                        Create a new task for{' '}
                        <RecordRepresentation
                            record={contact}
                            resource="contacts"
                        />
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="text"
                            label="Description"
                            required
                            multiline
                            fullWidth
                            disabled={isPending}
                        />
                        <Stack direction="row" spacing={1} mt={2}>
                            <TextField
                                margin="dense"
                                name="due_date"
                                label="Due date"
                                type="date"
                                defaultValue={new Date()
                                    .toISOString()
                                    .slice(0, 10)}
                                fullWidth
                                disabled={isPending}
                            />

                            <TextField
                                margin="dense"
                                name="type"
                                label="Type"
                                select
                                fullWidth
                                disabled={isPending}
                                defaultValue="None"
                            >
                                {taskTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpen(false)}
                            color="primary"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={isPending}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
