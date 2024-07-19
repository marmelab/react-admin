import * as React from 'react';
import {
    SimpleForm,
    Edit,
    TextInput,
    required,
    SelectInput,
    DateInput,
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
    const handleClose = () => {
        setTaskSelectedId(undefined);
    };

    return (
        <Dialog open={!!id} onClose={handleClose} fullWidth maxWidth="lg">
            {!!id ? (
                <Edit
                    id={id}
                    resource="tasks"
                    sx={{ '& .RaCreate-main': { mt: 0 } }}
                    mutationOptions={{
                        onSuccess: () => setTaskSelectedId(undefined),
                    }}
                    redirect={false}
                >
                    <SimpleForm>
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
                </Edit>
            ) : null}
        </Dialog>
    );
};
