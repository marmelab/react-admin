import * as React from 'react';
import {
    SimpleForm,
    TextInput,
    required,
    SelectInput,
    DateInput,
    Toolbar,
    SaveButton,
    DeleteButton,
    useNotify,
    EditBase,
} from 'react-admin';
import { Dialog, Stack } from '@mui/material';
import { taskTypes } from './task.const';

export const TaskEdit = ({
    id,
    setTaskSelectedId,
}: {
    id: string | undefined;
    setTaskSelectedId: (id: string | undefined) => void;
}) => {
    const notify = useNotify();
    const handleClose = () => {
        setTaskSelectedId(undefined);
    };

    return (
        <Dialog open={!!id} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <EditBase
                    id={id}
                    resource="tasks"
                    sx={{ '& .RaCreate-main': { mt: 0 } }}
                    mutationOptions={{
                        onSuccess: () => {
                            setTaskSelectedId(undefined);
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
                            <TaskEditToolBar
                                setTaskSelectedId={setTaskSelectedId}
                            />
                        }
                    >
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
                    </SimpleForm>
                </EditBase>
            ) : null}
        </Dialog>
    );
};

const TaskEditToolBar = ({
    setTaskSelectedId,
}: {
    setTaskSelectedId: (id: string | undefined) => void;
}) => {
    const notify = useNotify();
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <DeleteButton
                label="Delete"
                mutationOptions={{
                    onSuccess: () => {
                        setTaskSelectedId(undefined);
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
    );
};
