import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    Form,
    Labeled,
    TextField,
    TextInput,
    useDataProvider,
    useGetIdentity,
    useGetOne,
    useNotify,
    useUpdate,
} from 'react-admin';
import { useFormState } from 'react-hook-form';
import ImageEditorField from '../misc/ImageEditorField';
import { CrmDataProvider } from '../providers/types';
import { SalesFormData } from '../types';
import { useMutation } from '@tanstack/react-query';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const SettingsPage = () => {
    const [isEditMode, setEditMode] = useState(false);
    const { identity, refetch: refetchIdentity } = useGetIdentity();
    const { data, refetch: refetchUser } = useGetOne('sales', {
        id: identity?.id,
    });
    const notify = useNotify();
    const dataProvider = useDataProvider<CrmDataProvider>();

    const { mutate } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (data: SalesFormData) => {
            if (!identity) {
                throw new Error('Record not found');
            }
            return dataProvider.salesUpdate(identity.id, data);
        },
        onSuccess: () => {
            refetchIdentity();
            refetchUser();
            setEditMode(false);
            notify('Your profile has been updated');
        },
        onError: _ => {
            notify('An error occurred. Please try again', {
                type: 'error',
            });
        },
    });

    if (!identity) return null;

    const handleOnSubmit = async (values: any) => {
        mutate(values);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Form onSubmit={handleOnSubmit} record={data}>
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
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity, refetch } = useGetIdentity();
    const { isDirty } = useFormState();
    const dataProvider = useDataProvider<CrmDataProvider>();

    const { mutate } = useMutation({
        mutationKey: ['updatePassword'],
        mutationFn: async () => {
            if (!identity) {
                throw new Error('Record not found');
            }
            return dataProvider.updatePassword(identity.id);
        },
        onSuccess: () => {
            notify(
                'A reset password email has been sent to your email address'
            );
        },
        onError: e => {
            notify(`${e}`, {
                type: 'error',
            });
        },
    });

    if (!identity) return null;

    const handleClickOpenPasswordChange = () => {
        mutate();
    };

    const handleAvatarUpdate = async (values: any) => {
        await update(
            'sales',
            {
                id: identity.id,
                data: values,
                previousData: identity,
            },
            {
                onSuccess: () => {
                    refetch();
                    setEditMode(false);
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
        <Stack gap={4}>
            <Card>
                <CardContent>
                    <Stack
                        mb={2}
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography variant="h5" color="textSecondary">
                            My info
                        </Typography>
                    </Stack>
                    <Stack gap={2} mb={2}>
                        <ImageEditorField
                            source="avatar"
                            type="avatar"
                            onSave={handleAvatarUpdate}
                            linkPosition="right"
                        />
                        <TextRender
                            source="first_name"
                            isEditMode={isEditMode}
                        />
                        <TextRender
                            source="last_name"
                            isEditMode={isEditMode}
                        />
                        <TextRender source="email" isEditMode={isEditMode} />
                    </Stack>
                    {!isEditMode && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={handleClickOpenPasswordChange}
                            >
                                Change password
                            </Button>
                        </>
                    )}
                </CardContent>

                <CardActions
                    sx={{
                        paddingX: 2,
                        background: theme => theme.palette.background.default,
                        justifyContent: isEditMode
                            ? 'space-between'
                            : 'flex-end',
                    }}
                >
                    {isEditMode && (
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!isDirty}
                            hidden={isEditMode}
                        >
                            Save
                        </Button>
                    )}
                    <Button
                        variant="text"
                        size="small"
                        startIcon={
                            isEditMode ? <VisibilityIcon /> : <EditIcon />
                        }
                        onClick={() => setEditMode(!isEditMode)}
                    >
                        {isEditMode ? 'Show' : 'Edit'}
                    </Button>
                </CardActions>
            </Card>
            {import.meta.env.VITE_INBOUND_EMAIL && (
                <Card>
                    <CardContent>
                        <Stack gap={2} justifyContent="space-between">
                            <Typography variant="h5" color="textSecondary">
                                Inboud email
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                You can start sending emails to your server's
                                inbound email address, e.g. by adding it to the
                                <b> Cc: </b> field. Atomic CRM will process the
                                emails and add notes to the corresponding
                                contacts.
                            </Typography>
                            <CopyPaste />
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Stack>
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
        return <TextInput source={source} helperText={false} />;
    }
    return (
        <Labeled sx={{ mb: 0 }}>
            <TextField source={source} />
        </Labeled>
    );
};

const CopyPaste = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(import.meta.env.VITE_INBOUND_EMAIL);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };
    return (
        <Tooltip placement="top" title={copied ? 'Copied!' : 'Copy'}>
            <Button
                onClick={handleCopy}
                sx={{
                    textTransform: 'none',
                    justifyContent: 'space-between',
                }}
                endIcon={<ContentCopyIcon />}
            >
                {import.meta.env.VITE_INBOUND_EMAIL}
            </Button>
        </Tooltip>
    );
};

SettingsPage.path = '/settings';
