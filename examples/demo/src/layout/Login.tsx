import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
    ClickAwayListener,
    Divider,
    Stack,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

import Flag from 'react-world-flags';

import {
    Form,
    required,
    TextInput,
    useTranslate,
    useLocaleState,
    useLogin,
    useNotify,
} from 'react-admin';

import Box from '@mui/material/Box';

const LanguageDropdown = () => {
    const [locale, setLocale] = useLocaleState();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClick = () => setIsDropdownOpen(!isDropdownOpen);
    const handleClose = () => setIsDropdownOpen(false);
    const handleLocaleSelect = (localeCode: 'en' | 'fr' | 'de') => {
        setLocale(localeCode);
        handleClose();
    };

    const getFlagIcon = (localeCode: string) => {
        switch (localeCode) {
            case 'en':
                return <Flag code="GB" />;
            case 'fr':
                return <Flag code="FR" />;
            case 'de':
                return <Flag code="DE" />;
            default:
                return <Flag code="GB" />;
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Stack
                direction="column"
                sx={{
                    position: 'relative',
                    zIndex: 999,
                }}
            >
                {!isDropdownOpen && (
                    <Button
                        onClick={handleClick}
                        startIcon={getFlagIcon(locale)}
                        sx={
                            {
                                // position: 'relative',
                            }
                        }
                    >
                        {getFlagIcon(locale)}
                    </Button>
                )}

                {isDropdownOpen && (
                    <Box
                        sx={{
                            // position: 'relative',
                            zIndex: 1,
                            // left: 0,
                            // right: 0,
                            borderRadius: '0 0 0.5rem 0.5rem',
                            boxShadow: '0 0.5rem 1rem 0 rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: 'blue',
                        }}
                    >
                        <Button
                            onClick={() => handleLocaleSelect('en')}
                            sx={{
                                margin: '0.1rem',
                                width: '100%',
                            }}
                        >
                            {getFlagIcon('en')}
                        </Button>
                        <Divider />

                        <Button
                            onClick={() => handleLocaleSelect('de')}
                            sx={{
                                margin: '0.1rem',
                                width: '100%',
                            }}
                        >
                            {getFlagIcon('de')}
                        </Button>
                        <Divider />
                        <Button
                            onClick={() => handleLocaleSelect('fr')}
                            sx={{
                                margin: '0.1rem',
                                width: '100%',
                            }}
                        >
                            {getFlagIcon('fr')}
                        </Button>
                    </Box>
                )}
            </Stack>
        </ClickAwayListener>
    );
};

const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(
            auth,
            location.state ? (location.state as any).nextPathname : '/'
        ).catch((error: Error) => {
            setLoading(false);
            notify(
                typeof error === 'string'
                    ? error
                    : typeof error === 'undefined' || !error.message
                    ? 'ra.auth.sign_in_error'
                    : error.message,
                {
                    type: 'warning',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
        });
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background:
                        'url(https://source.unsplash.com/random/1600x900/?food)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    zIndex: -1,
                }}
            >
                <Card
                    sx={{
                        minWidth: 300,
                        minHeight: '50vh',
                        marginTop: '8em',
                        boxShadow: '0px 10px 13px -7px #000000',
                        border: '5px 5px 15px 5px #000000',
                    }}
                >
                    <Box
                        sx={{
                            padding: '3em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: 'secondary.main',
                                width: '3em',
                                height: '3em',
                                padding: '0.3em',
                                position: 'absolute',
                            }}
                        >
                            <LockIcon
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            marginTop: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        Hint: demo / demo
                    </Box>
                    <Box sx={{ padding: '0 1em 1em 1em' }}>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                autoFocus
                                source="email"
                                type="email"
                                label="Email"
                                disabled={loading}
                                validate={required()}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                source="password"
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                                validate={required()}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <CardActions
                        sx={{
                            padding: '0 1em 1em 1em',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading && (
                                <CircularProgress size={25} thickness={2} />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button>
                        <Box sx={{ marginTop: '1rem' }}>
                            <LanguageDropdown />
                        </Box>
                    </CardActions>
                </Card>

                {/* <Card
                    sx={{
                        minWidth: 300,
                        height: '100%',
                        marginTop: '1em',
                        boxShadow: '0px 10px 13px -7px #000000',
                        border: '5px 5px 15px 5px #000000',
                    }}
                > */}
                {/* use LanguageDropdown here 
                    to allow users to change the language */}
                {/* <Box
                        sx={{
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            // backgroundColor: 'blue',
                        }}
                    >
                        <LanguageDropdown />
                    </Box>
                </Card> */}
            </Box>
        </Form>
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
    email?: string;
    password?: string;
}
