import { Container, Skeleton, Stack } from '@mui/material';

export const LoginSkeleton = () => {
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
