import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useGetIdentity, useGetOne, useNotify, useUpdate } from 'react-admin';
import { useForm } from 'react-hook-form';

const PASSWORD_POLICY = {
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Example policy: Minimum 8 characters, at least one letter and one number
    text: 'Password must be at least 8 characters long and contain at least one letter and one number.',
};

export const UpdatePassword = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const [update] = useUpdate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: 'onChange',
    });
    const newPassword = watch('newPassword');
    const { identity } = useGetIdentity();
    const notify = useNotify();
    const { data: dataUser, refetch } = useGetOne('sales', {
        id: identity?.id,
    });

    if (!identity) return null;

    const onSubmit = async (data: any) => {
        await update(
            'sales',
            {
                id: identity.id,
                data: {
                    password: data.newPassword,
                },
                previousData: identity,
            },
            {
                onSuccess: _ => {
                    notify('Your password has been updated');
                    setOpen(false);
                    refetch();
                    reset();
                },
                onError: _ => {
                    notify('An error occurred. Please try again', {
                        type: 'error',
                    });
                },
            }
        );
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                >
                    Password for Jane Doe account is "password"
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack gap={2}>
                        <TextField
                            {...register('currentPassword', {
                                required: 'Current password is required',
                                validate: value => value === dataUser.password,
                            })}
                            autoFocus
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            error={!!errors.currentPassword}
                            helperText={
                                errors.currentPassword
                                    ? 'Current password is incorrect'
                                    : ''
                            }
                        />
                        <TextField
                            {...register('newPassword', {
                                required: 'New password is required',
                                pattern: {
                                    value: PASSWORD_POLICY.regex,
                                    message: PASSWORD_POLICY.text,
                                },
                            })}
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            error={!!errors.newPassword}
                            helperText={
                                errors.newPassword ? PASSWORD_POLICY.text : ''
                            }
                        />
                        <TextField
                            {...register('confirmNewPassword', {
                                required: 'Please confirm your new password',
                                validate: value =>
                                    value === newPassword ||
                                    'Passwords do not match',
                            })}
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            error={!!errors.confirmNewPassword}
                            helperText={
                                errors.confirmNewPassword
                                    ? 'Passwords do not match'
                                    : ''
                            }
                        />
                    </Stack>
                    <DialogActions>
                        <Button
                            variant="text"
                            onClick={handleClose}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!isValid}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};
