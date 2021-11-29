import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, withTypes } from 'react-final-form';
import { useLocation } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
    TextField,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { Notification, useTranslate, useLogin, useNotify } from 'react-admin';

import { lightTheme } from './themes';

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

const renderInput = ({
    meta: { touched, error } = { touched: false, error: undefined },
    input: { ...inputProps },
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

interface FormValues {
    username?: string;
    password?: string;
}

const { Form } = withTypes<FormValues>();

const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(auth, location.state ? location.state.nextPathname : '/').catch(
            (error: Error) => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    'warning',
                    {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    }
                );
            }
        );
    };

    const validate = (values: FormValues) => {
        const errors: FormValues = {};
        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        if (!values.password) {
            errors.password = translate('ra.validation.required');
        }
        return errors;
    };

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validate}
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
                                    <Field
                                        autoFocus
                                        name="username"
                                        // @ts-ignore
                                        component={renderInput}
                                        label={translate('ra.auth.username')}
                                        disabled={loading}
                                    />
                                </div>
                                <div className={classes.input}>
                                    <Field
                                        name="password"
                                        // @ts-ignore
                                        component={renderInput}
                                        label={translate('ra.auth.password')}
                                        type="password"
                                        disabled={loading}
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
