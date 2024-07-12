import {
    Button,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { CreateButton } from 'react-admin';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const DENSE_NAVBAR_HEIGHT = 48;
const DENSE_NAVBAR_HEIGHT_MOBILE = 64;

export default function useAppBarHeight(): number {
    const { breakpoints } = useTheme();
    const queryDesktop = breakpoints.up('sm');
    return useMediaQuery(queryDesktop)
        ? DENSE_NAVBAR_HEIGHT
        : DENSE_NAVBAR_HEIGHT_MOBILE;
}

export const ContactEmpty = () => {
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
                No contacts found
            </Typography>
            <Typography
                variant="caption"
                align="center"
                color="text.secondary"
                gutterBottom
            >
                It looks like your contact list is empty.
            </Typography>
            <Stack spacing={2} direction="row">
                <CreateButton variant="contained" label="New Contact" />
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    disabled
                >
                    Import Contacts
                </Button>
            </Stack>
        </Stack>
    );
};
