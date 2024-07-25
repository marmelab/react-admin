import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material';
import * as React from 'react';
import {
    DateInput,
    DeleteButton,
    EditBase,
    Form,
    required,
    SaveButton,
    SelectInput,
    TextInput,
    Toolbar,
    useNotify,
} from 'react-admin';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { DialogCloseButton } from '../misc/DialogCloseButton';

export const TaskEdit = ({
    open,
    close,
    taskId,
}: {
    taskId: string;
    open: boolean;
    close: () => void;
}) => {
    const { taskTypes } = useConfigurationContext();
    const notify = useNotify();
    return (
        <Dialog
            open={open}
            onClose={close}
            fullWidth
            disableRestoreFocus
            maxWidth="sm"
        >
            <EditBase
                id={taskId}
                resource="tasks"
                sx={{ '& .RaCreate-main': { mt: 0 } }}
                mutationOptions={{
                    onSuccess: () => {
                        close();
                        notify('Task updated', {
                            type: 'info',
                            undoable: true,
                        });
                    },
                }}
                redirect={false}
            >
                <Form>
                    <DialogCloseButton onClose={close} />
                    <DialogTitle id="form-dialog-title">Edit task</DialogTitle>
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
                                justifyContent: 'space-between',
                                gap: 1,
                            }}
                        >
                            <SaveButton label="Save" />
                            <DeleteButton
                                label="Delete"
                                mutationOptions={{
                                    onSuccess: () => {
                                        close();
                                        notify('Task deleted', {
                                            type: 'info',
                                            undoable: true,
                                        });
                                    },
                                }}
                                redirect={false}
                            />
                        </Toolbar>
                    </DialogActions>
                </Form>
            </EditBase>
        </Dialog>
    );
};
