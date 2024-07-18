import EditIcon from '@mui/icons-material/Edit';
import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import {
    Form,
    TextInput,
    useGetIdentity,
    useGetOne,
    useNotify,
    useUpdate,
} from 'react-admin';
import { useFormState } from 'react-hook-form';
import { UpdatePassword } from './UpdatePassword';

export const SettingsPage = () => {
    const [update] = useUpdate();
    const [isEditMode, setIsEditMode] = useState(false);
    const { identity, refetch } = useGetIdentity();
    const user = useGetOne('users', { id: identity?.id });
    const notify = useNotify();

    if (!identity) return null;

    const handleOnSubmit = async (values: any) => {
        await update(
            'users',
            {
                id: identity.id,
                data: values,
                previousData: identity,
            },
            {
                onSuccess: data => {
                    localStorage.setItem('user', JSON.stringify(data));
                    refetch();
                    setIsEditMode(false);
                    notify('Your profile has been updated');
                },
                onError: _ => {
                    notify('An error occurred. Please try again', {
                        type: 'error',
                    });
                },
            }
        );
    };

    return (
        <>
            <Stack mt={2} direction="row" justifyContent="space-between">
                <Typography variant="h5" color="textSecondary">
                    My info
                </Typography>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    Edit
                </Button>
            </Stack>
            <Form onSubmit={handleOnSubmit} record={user.data}>
                <SettingsForm readOnly={!isEditMode} />
            </Form>
        </>
    );
};

const SettingsForm = ({ readOnly }: { readOnly: boolean }) => {
    const { isDirty } = useFormState();
    const [openPasswordChange, setOpenPasswordChange] = useState(false);

    const handleClickOpenPasswordChange = () => {
        setOpenPasswordChange(true);
    };

    return (
        <>
            <Stack>
                <TextInput source="full_name" readOnly={readOnly} />
                <TextInput source="email" readOnly={readOnly} />
            </Stack>
            <Stack
                gap={2}
                direction="row"
                justifyContent={readOnly ? 'flex-end' : 'space-between'}
            >
                {!readOnly && (
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!isDirty}
                        hidden={readOnly}
                    >
                        Save
                    </Button>
                )}
                <Button
                    variant="outlined"
                    onClick={handleClickOpenPasswordChange}
                >
                    Change password
                </Button>
            </Stack>
            <UpdatePassword
                open={openPasswordChange}
                setOpen={setOpenPasswordChange}
            />
        </>
    );
};

SettingsPage.path = '/settings';
