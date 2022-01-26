import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import {
    Form,
    Notification,
    required,
    TextInput,
    useTranslate,
    useLogin,
    useNotify,
} from 'react-admin';

import { lightTheme } from './themes';

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
        <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit }) => (
                <StyledForm onSubmit={handleSubmit} noValidate>
                    <div className={classes.main}>
                        <Card className={classes.card}>
                            <div className={classes.avatar}>
                                <Avatar className={classes.icon}>
                                    <LockIcon />
                                </Avatar>
                            </div>
                            <div className={classes.hint}>
                                Hint: demo / demo
                            </div>
                            <div className={classes.form}>
                                <div className={classes.input}>
                                    <TextInput
                                        autoFocus
                                        source="username"
                                        label={translate('ra.auth.username')}
                                        disabled={loading}
                                        validate={required()}
                                        fullWidth
                                    />
                                </div>
                                <div className={classes.input}>
                                    <TextInput
                                        source="password"
                                        label={translate('ra.auth.password')}
                                        type="password"
                                        disabled={loading}
                                        validate={required()}
                                        fullWidth
                                    />
                                </div>
                            </div>
                            <CardActions className={classes.actions}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading && (
                                        <CircularProgress
                                            size={25}
                                            thickness={2}
                                        />
                                    )}
                                    {translate('ra.auth.sign_in')}
                                </Button>
                            </CardActions>
                        </Card>
                        <Notification />
                    </div>
                </StyledForm>
            )}
        />
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component

// the right theme
const LoginWithTheme = (props: any) => (
    <ThemeProvider theme={createTheme(lightTheme)}>
        <Login {...props} />
    </ThemeProvider>
);

export default LoginWithTheme;

interface FormValues {
    username?: string;
    password?: string;
}

const PREFIX = 'LoginWithTheme';

const classes = {
    main: `${PREFIX}-main`,
    card: `${PREFIX}-card`,
    avatar: `${PREFIX}-avatar`,
    icon: `${PREFIX}-icon`,
    hint: `${PREFIX}-hint`,
    form: `${PREFIX}-form`,
    input: `${PREFIX}-input`,
    actions: `${PREFIX}-actions`,
};

const StyledForm = styled('form')(({ theme }) => ({
    [`& .${classes.main}`]: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url(https://source.unsplash.com/random/1600x900)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },

    [`& .${classes.card}`]: {
        minWidth: 300,
        marginTop: '6em',
    },

    [`& .${classes.avatar}`]: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },

    [`& .${classes.icon}`]: {
        backgroundColor: theme.palette.secondary.main,
    },

    [`& .${classes.hint}`]: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        color: theme.palette.grey[500],
    },

    [`& .${classes.form}`]: {
        padding: '0 1em 1em 1em',
    },

    [`& .${classes.input}`]: {
        marginTop: '1em',
    },

    [`& .${classes.actions}`]: {
        padding: '0 1em 1em 1em',
    },
}));
