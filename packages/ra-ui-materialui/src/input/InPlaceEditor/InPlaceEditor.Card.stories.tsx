import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
    createTheme,
    Avatar,
    Box,
    ThemeProvider,
    Card,
    Divider,
    Stack,
    Typography,
    IconButton,
} from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    ResourceContextProvider,
    DataProviderContext,
    I18nContextProvider,
    ShowBase,
    TestMemoryRouter,
    NotificationContextProvider,
    UndoableMutationsContextProvider,
    required,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { InPlaceEditor } from './InPlaceEditor';
import { SelectInput } from '../SelectInput';
import { ChipField, SelectField } from '../../field';
import { Notification } from '../../layout';

export default {
    title: 'ra-ui-materialui/input/InPlaceEditor',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const Wrapper = ({ children, dataProvider }) => (
    <TestMemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            <DataProviderContext.Provider value={dataProvider}>
                <UndoableMutationsContextProvider>
                    <I18nContextProvider value={i18nProvider}>
                        <ThemeProvider theme={createTheme()}>
                            <NotificationContextProvider>
                                <ResourceContextProvider value="users">
                                    <ShowBase id={1}>{children}</ShowBase>
                                    <Notification />
                                </ResourceContextProvider>
                            </NotificationContextProvider>
                        </ThemeProvider>
                    </I18nContextProvider>
                </UndoableMutationsContextProvider>
            </DataProviderContext.Provider>
        </QueryClientProvider>
    </TestMemoryRouter>
);

export const Complex = () => {
    const dataProvider = fakeRestDataProvider(
        {
            users: [
                {
                    id: 1,
                    name: 'Kevin Malon',
                    phone: '(+91) 999 564 4837',
                    email: 'kevinmalon@gmail.com',
                    leadStatus: 'customer',
                    access: 'everyone',
                },
            ],
        },
        process.env.NODE_ENV !== 'test',
        500
    );
    return (
        <Wrapper dataProvider={dataProvider}>
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    px: 2,
                    py: 3,
                    my: 2,
                    mx: 20,
                    width: 300,
                }}
            >
                <Box
                    sx={{
                        display: 'absolute',
                        bgcolor: 'grey.300',
                        mx: -2,
                        mt: -3,
                        mb: -5,
                        top: 0,
                        right: 0,
                        height: 60,
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Avatar
                        src="https://mui.com/static/images/avatar/2.jpg"
                        sx={{ width: 56, height: 56, marginBottom: 0.5 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <InPlaceEditor
                        source="name"
                        sx={{
                            '& .RaInPlaceEditor-reading div, & .RaInPlaceEditor-saving div, & .RaInPlaceEditor-editing input':
                                {
                                    fontSize: '1.2rem',
                                },
                            '& .RaInPlaceEditor-editing input': {
                                textAlign: 'center',
                            },
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1.5,
                        my: 1,
                    }}
                >
                    <IconButton sx={{ bgcolor: '#eff9fd' }} color="inherit">
                        <PhoneOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#eff9fd' }} color="inherit">
                        <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#eff9fd' }} color="inherit">
                        <EmailOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ bgcolor: '#eff9fd' }} color="inherit">
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider sx={{ my: 2, mx: -2 }} />
                <Stack gap={1}>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <PhoneOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: 'text.secondary' }}
                                />
                                <Typography color="text.secondary">
                                    Phone
                                </Typography>
                            </Box>
                            <InPlaceEditor
                                source="phone"
                                sx={{
                                    '& input': {
                                        textAlign: 'right',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <EmailOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: 'text.secondary' }}
                                />
                                <Typography color="text.secondary">
                                    Email
                                </Typography>
                            </Box>
                            <InPlaceEditor
                                source="email"
                                sx={{
                                    '& input': {
                                        textAlign: 'right',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <LocalOfferOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: 'text.secondary' }}
                                />
                                <Typography color="text.secondary">
                                    Lead Status
                                </Typography>
                            </Box>
                            <InPlaceEditor
                                source="leadStatus"
                                editor={
                                    <SelectInput
                                        source="leadStatus"
                                        choices={[
                                            {
                                                id: 'customer',
                                                name: 'Customer',
                                            },
                                            {
                                                id: 'prospect',
                                                name: 'Prospect',
                                            },
                                        ]}
                                        size="small"
                                        variant="standard"
                                        label={false}
                                        margin="none"
                                        helperText={false}
                                        autoFocus
                                        SelectProps={{ defaultOpen: true }}
                                        sx={{
                                            '& .MuiInput-root': {
                                                marginTop: 0,
                                            },
                                            '& .MuiSelect-select': {
                                                textAlign: 'right',
                                            },
                                        }}
                                    />
                                }
                            >
                                <SelectField
                                    source="leadStatus"
                                    choices={[
                                        { id: 'customer', name: 'Customer' },
                                        { id: 'prospect', name: 'Prospect' },
                                    ]}
                                    optionText={
                                        <ChipField
                                            size="small"
                                            variant="outlined"
                                            source="name"
                                            color="success"
                                        />
                                    }
                                    sx={{
                                        display: 'block',
                                        marginBottom: '3px',
                                        marginTop: '2px',
                                    }}
                                />
                            </InPlaceEditor>
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <VisibilityOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: 'text.secondary' }}
                                />
                                <Typography color="text.secondary">
                                    Access
                                </Typography>
                            </Box>
                            <InPlaceEditor
                                source="access"
                                editor={
                                    <SelectInput
                                        source="access"
                                        choices={[
                                            {
                                                id: 'everyone',
                                                name: 'Everyone',
                                            },
                                            { id: 'just_me', name: 'Just me' },
                                            { id: 'sales', name: 'Sales' },
                                        ]}
                                        size="small"
                                        variant="standard"
                                        label={false}
                                        margin="none"
                                        helperText={false}
                                        autoFocus
                                        SelectProps={{ defaultOpen: true }}
                                        validate={required()}
                                        sx={{
                                            '& .MuiInput-root': {
                                                marginTop: 0,
                                            },
                                            '& .MuiSelect-select': {
                                                textAlign: 'right',
                                            },
                                        }}
                                    />
                                }
                            >
                                <SelectField
                                    source="access"
                                    variant="body1"
                                    choices={[
                                        { id: 'everyone', name: 'Everyone' },
                                        { id: 'just_me', name: 'Just me' },
                                        { id: 'sales', name: 'Sales' },
                                    ]}
                                    sx={{
                                        display: 'block',
                                        marginBottom: '5px',
                                    }}
                                />
                            </InPlaceEditor>
                        </Box>
                    </Box>
                </Stack>
            </Card>
        </Wrapper>
    );
};
