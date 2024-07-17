import { Container, Skeleton, Stack } from '@mui/material';
import { useGetList } from 'react-admin';
import { LoginForm } from './LoginForm';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
    const { total, isPending, error } = useGetList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    if (isPending) return <LoginPageSkeleton />;
    if (error) return <LoginForm />;
    if (total && total > 0) return <LoginForm />;

    return <Navigate to="/sign-up" />;
};

const LoginPageSkeleton = () => {
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
