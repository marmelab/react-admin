import { Stack, Typography } from '@mui/material';
import { CreateButton } from 'react-admin';
import useAppBarHeight from '../misc/useAppBarHeight';

export const CompanyEmpty = () => {
    const appbarHeight = useAppBarHeight();
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{
                height: `calc(100dvh - ${appbarHeight}px)`,
            }}
        >
            <img src="./img/empty.svg" alt="No contacts found" />
            <Typography variant="h6" fontWeight="bold">
                No companies found
            </Typography>
            <Typography
                variant="caption"
                align="center"
                color="text.secondary"
                gutterBottom
            >
                It looks like your company list is empty.
            </Typography>
            <Stack spacing={2} direction="row">
                <CreateButton variant="contained" label="Create Company" />
            </Stack>
        </Stack>
    );
};
