import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useCreate, useGetList, useLogin, useNotify } from 'react-admin';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import { LoginSkeleton } from './LoginSkeleton';
import { useConfigurationContext } from '../root/ConfigurationContext';

interface UserInput {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const SignupPage = () => {
    const { logo, title } = useConfigurationContext();
    const { total, isPending } = useGetList('sales', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    const login = useLogin();
    const notify = useNotify();
    const [create] = useCreate();

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<UserInput>({
        mode: 'onChange',
    });

    if (isPending) {
        return <LoginSkeleton />;
    }

    // For the moment, we only allow one user to sign up. Other users must be created by the administrator.
    if (total) {
        return <Navigate to="/login" />;
    }

    const onSubmit: SubmitHandler<UserInput> = async data => {
        await create(
            'sales',
            { data: { ...data, administrator: true } }, // The first sale is an administrator
            {
                onSuccess: () => {
                    login({
                        email: data.email,
                        password: data.password,
                        redirectTo: '/contacts',
                    });
                    setTimeout(() => {
                        notify(
                            'Welcome! You can now start entering contacts, write notes and plan deals'
                        );
                    }, 0);
                },
                onError: () => {
                    notify('An error occurred. Please try again.');
                },
            }
        );
    };

    return (
        <Stack sx={{ height: '100dvh', p: 2 }}>
            <Stack direction="row" alignItems="center" gap={1}>
                <img src={logo} alt={title} width={50} />
                <Typography component="span" variant="h5">
                    {title}
                </Typography>
            </Stack>
            <Stack sx={{ height: '100%' }}>
                <Container
                    maxWidth="xs"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Create your account to manage your contacts, companies,
                        and deals.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('first_name', { required: true })}
                            label="First name"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('last_name', { required: true })}
                            label="Last name"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('email', { required: true })}
                            label="Email"
                            type="email"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('password', { required: true })}
                            label="Password"
                            type="password"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isValid}
                            >
                                Create account
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Stack>
        </Stack>
    );
};

SignupPage.path = '/sign-up';
