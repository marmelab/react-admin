import {
    Button,
    Container,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useCreate, useGetList, useLogin, useNotify } from 'react-admin';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginCRM } from './LoginCRM';

interface UserInput {
    full_name: string;
    email: string;
    password: string;
}

export const LoginPage = () => {
    const { total, isPending, error } = useGetList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    if (isPending) return <SignUpSkelton />;
    if (error) return <LoginCRM />;
    if (total && total > 0) return <LoginCRM />;

    return <SignUp />;
};

const SignUp = () => {
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

    const onSubmit: SubmitHandler<UserInput> = async data => {
        await create(
            'users',
            { data: { ...data, administrator: true } },
            {
                onSuccess: () => {
                    login({
                        email: data.email,
                        password: data.password,
                        redirectTo: '/contacts',
                    });
                },
                onError: () => {
                    notify('An error occurred. Please try again.');
                },
            }
        );
    };

    return (
        <Container maxWidth="xl" sx={{ height: '100dvh', pt: 2 }}>
            <Stack sx={{ height: '100%' }}>
                <img src="./logo192.png" alt="Atomic CRM" width={50} />

                <Container
                    maxWidth="sm"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome to Atomic CRM!
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Create your account to manage your contacts, companies,
                        and deals.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('full_name', { required: true })}
                            label="Full name"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            {...register('email', { required: true })}
                            label="email"
                            type="email"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('password', { required: true })}
                            label="password"
                            type="password"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid}
                        >
                            Create account
                        </Button>
                    </form>
                </Container>
            </Stack>
        </Container>
    );
};

const SignUpSkelton = () => {
    return (
        <Container maxWidth="xl" sx={{ height: '100dvh', pt: 2 }}>
            <Stack sx={{ height: '100%' }}>
                <Container
                    maxWidth="sm"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <Skeleton variant="rectangular" width="80%" height={50} />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                    <Skeleton variant="rectangular" width="100%" height={36} />
                    <Skeleton variant="rectangular" width="40%" height={36} />
                </Container>
            </Stack>
        </Container>
    );
};
