import {
    Button,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    useDataProvider,
    useLogin,
    useNotify,
    usePermissions,
} from 'react-admin';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import { CrmDataProvider } from '../providers/types';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { SignUpData } from '../types';
import { LoginSkeleton } from './LoginSkeleton';

export const SignupPage = () => {
    const { refetch } = usePermissions();
    const dataProvider = useDataProvider<CrmDataProvider>();
    const { logo, title } = useConfigurationContext();
    const { data: isInitialized, isPending } = useQuery({
        queryKey: ['init'],
        queryFn: async () => {
            return dataProvider.isInitialized();
        },
    });

    const { isPending: isSignUpPending, mutate } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (data: SignUpData) => {
            return dataProvider.signUp(data);
        },
        onSuccess: data => {
            login({
                email: data.email,
                password: data.password,
                redirectTo: '/contacts',
            }).then(() => {
                notify('Initial user successfully created');
                refetch();
            });
        },
        onError: () => {
            notify('An error occurred. Please try again.');
        },
    });

    const login = useLogin();
    const notify = useNotify();

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<SignUpData>({
        mode: 'onChange',
    });

    if (isPending) {
        return <LoginSkeleton />;
    }

    // For the moment, we only allow one user to sign up. Other users must be created by the administrator.
    if (isInitialized) {
        return <Navigate to="/login" />;
    }

    const onSubmit: SubmitHandler<SignUpData> = async data => {
        mutate(data);
    };

    return (
        <Stack sx={{ height: '100dvh', p: 2 }}>
            <Stack direction="row" alignItems="center" gap={1}>
                <img
                    src={logo}
                    alt={title}
                    width={24}
                    style={{ filter: 'invert(0.9)' }}
                />
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
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Atomic CRM
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Create the first user account to complete the setup.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('first_name', { required: true })}
                            label="First name"
                            variant="outlined"
                            required
                        />
                        <TextField
                            {...register('last_name', { required: true })}
                            label="Last name"
                            variant="outlined"
                            required
                        />
                        <TextField
                            {...register('email', { required: true })}
                            label="Email"
                            type="email"
                            variant="outlined"
                            required
                        />
                        <TextField
                            {...register('password', { required: true })}
                            label="Password"
                            type="password"
                            variant="outlined"
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
                                disabled={!isValid || isSignUpPending}
                                fullWidth
                            >
                                {isSignUpPending ? (
                                    <CircularProgress />
                                ) : (
                                    'Create account'
                                )}
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Stack>
        </Stack>
    );
};

SignupPage.path = '/sign-up';
