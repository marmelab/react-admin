import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
    Labeled,
    TextField,
    TextInput,
    useGetIdentity,
    useGetOne,
    useNotify,
    useUpdate,
} from 'react-admin';
import { useFormState } from 'react-hook-form';
import { USER_STORAGE_KEY } from '../authProvider';
import { UpdatePassword } from './UpdatePassword';

export const SettingsPage = () => {
    const [update] = useUpdate();
    const [isEditMode, setEditMode] = useState(true);
    const { identity, refetch } = useGetIdentity();
    const user = useGetOne('sales', { id: identity?.id });
    const notify = useNotify();

    if (!identity) return null;

    const handleOnSubmit = async (values: any) => {
        await update(
            'sales',
            {
                id: identity.id,
                data: values,
                previousData: identity,
            },
            {
                onSuccess: data => {
                    // Update local user
                    localStorage.setItem(
                        USER_STORAGE_KEY,
                        JSON.stringify(data)
                    );
                    refetch();
                    setEditMode(true);
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
                <SettingsForm
                    isEditMode={isEditMode}
                    setEditMode={setEditMode}
                />
            </Form>
        </Container>
    );
};

const SettingsForm = ({
    isEditMode,
    setEditMode,
}: {
    isEditMode: boolean;
    setEditMode: (value: boolean) => void;
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
                        startIcon={
                            isEditMode ? <EditIcon /> : <VisibilityIcon />
                        }
                        onClick={() => setEditMode(!isEditMode)}
                    >
                        {isEditMode ? 'Edit' : 'Show'}
                    </Button>
                </Stack>
                <Stack gap={2} mb={2}>
                    <TextRender source="first_name" isEditMode={isEditMode} />
                    <TextRender source="last_name" isEditMode={isEditMode} />
                    <TextRender source="email" isEditMode={isEditMode} />
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
            {!isEditMode && (
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
                        hidden={isEditMode}
                    >
                        Save
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

const TextRender = ({
    source,
    isEditMode,
}: {
    source: string;
    isEditMode: boolean;
}) => {
    if (isEditMode) {
        return (
            <Labeled mb={'20px'}>
                <TextField source={source} />
            </Labeled>
        );
    }
    return <TextInput source={source} helperText={false} />;
};

SettingsPage.path = '/settings';
