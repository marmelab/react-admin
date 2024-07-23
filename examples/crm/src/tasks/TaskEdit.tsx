import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import * as React from 'react';
import {
    DateInput,
    DeleteButton,
    EditBase,
    required,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useNotify,
} from 'react-admin';
import { taskTypes } from './task.const';

export const TaskEdit = ({
    open,
    close,
    taskId,
}: {
    taskId: string;
    open: boolean;
    close: () => void;
}) => {
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
                <SimpleForm
                    toolbar={
                        <Toolbar
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
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
                            <SaveButton label="Save" />
                        </Toolbar>
                    }
                >
                    <DialogTitle id="form-dialog-title">Edit task</DialogTitle>
                    <DialogContent sx={{ width: '100%' }}>
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
                </SimpleForm>
            </EditBase>
        </Dialog>
    );
};
