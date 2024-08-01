import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    Typography,
    Button,
} from '@mui/material';
import useAppBarHeight from '../misc/useAppBarHeight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import { CreateButton, Identifier } from 'react-admin';
import { ContactImportButton } from '../contacts/ContactImportButton';
import { Link } from 'react-router-dom';

export const DashboardStepper = ({
    step,
    contactId,
}: {
    step: number;
    contactId?: Identifier;
}) => {
    const appbarHeight = useAppBarHeight();
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                height: `calc(100dvh - ${appbarHeight}px)`,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                }}
            >
                <CardContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            What's next?
                        </Typography>
                        <Box sx={{ width: '150px' }}>
                            <LinearProgress
                                variant="determinate"
                                value={(step / 3) * 100}
                                color="success"
                            />
                            <Typography variant="body2" align="right">
                                {step}/3 done
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack gap={3}>
                        <Stack gap={2} direction="row">
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">
                                Install Atomic CRM
                            </Typography>
                        </Stack>
                        <Stack gap={2} direction="row">
                            {step > 1 ? (
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                />
                            ) : (
                                <RadioButtonUncheckedOutlinedIcon
                                    color="disabled"
                                    fontSize="small"
                                />
                            )}

                            <Stack gap={1}>
                                <Typography variant="body2" fontWeight="bold">
                                    Add your first contact
                                </Typography>
                                <Typography variant="caption">
                                    Create or import your contacts
                                </Typography>
                                <Stack spacing={2} direction="row">
                                    <CreateButton
                                        variant="contained"
                                        label="New Contact"
                                        resource="contacts"
                                        size="small"
                                    />
                                    <ContactImportButton />
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack gap={2} direction="row">
                            <RadioButtonUncheckedOutlinedIcon
                                fontSize="small"
                                color="disabled"
                            />
                            <Stack gap={1}>
                                <Typography variant="body2" fontWeight="bold">
                                    Add your first note
                                </Typography>
                                <Typography variant="caption">
                                    Got to a contact page and add a note
                                </Typography>
                                <Button
                                    component={Link}
                                    variant="contained"
                                    size="small"
                                    disabled={step < 2}
                                    sx={{
                                        width: '100px',
                                    }}
                                    to={`/contacts/${contactId}/show`}
                                >
                                    Add note
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};
