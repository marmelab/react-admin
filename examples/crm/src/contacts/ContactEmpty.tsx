import { Stack, Typography } from '@mui/material';
import { CreateButton } from 'react-admin';
import useAppBarHeight from '../misc/useAppBarHeight';
import { ContactImportButton } from './ContactImportButton';

export const ContactEmpty = () => {
    const appbarHeight = useAppBarHeight();
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap={3}
            sx={{
                height: `calc(100dvh - ${appbarHeight}px)`,
            }}
        >
            <img src="./img/empty.svg" alt="No contacts found" />
            <Stack gap={0} alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                    No contacts found
                </Typography>
                <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                    gutterBottom
                >
                    It seems your contact list is empty.
                </Typography>
            </Stack>
            <Stack spacing={2} direction="row">
                <CreateButton variant="contained" label="New Contact" />
                <ContactImportButton />
            </Stack>
        </Stack>
    );
};
