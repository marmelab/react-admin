import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Stack,
    Typography,
} from '@mui/material';
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
    const [isReadOnly, setReadOnly] = useState(true);
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
                    setReadOnly(true);
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
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Form onSubmit={handleOnSubmit} record={user.data}>
                <SettingsForm readOnly={isReadOnly} setReadOnly={setReadOnly} />
            </Form>
        </Container>
    );
};

const SettingsForm = ({
    readOnly,
    setReadOnly,
}: {
    readOnly: boolean;
    setReadOnly: (value: boolean) => void;
}) => {
    const { isDirty } = useFormState();
    const [openPasswordChange, setOpenPasswordChange] = useState(false);

    const handleClickOpenPasswordChange = () => {
        setOpenPasswordChange(true);
    };

    return (
        <Card>
            <CardContent>
                <Stack mb={2} direction="row" justifyContent="space-between">
                    <Typography variant="h5" color="textSecondary">
                        My info
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setReadOnly(!readOnly)}
                    >
                        Edit
                    </Button>
                </Stack>
                <Stack>
                    <TextInput source="full_name" readOnly={readOnly} />
                    <TextInput source="email" readOnly={readOnly} />
                </Stack>
                <Button
                    variant="outlined"
                    onClick={handleClickOpenPasswordChange}
                >
                    Change password
                </Button>
                <UpdatePassword
                    open={openPasswordChange}
                    setOpen={setOpenPasswordChange}
                />
            </CardContent>
            {!readOnly && (
                <CardActions
                    sx={{
                        paddingX: 2,
                        background: theme => theme.palette.background.default,
                    }}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!isDirty}
                        hidden={readOnly}
                    >
                        Save
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

SettingsPage.path = '/settings';
