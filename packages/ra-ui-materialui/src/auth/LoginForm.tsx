import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import {
    Button,
    CardActions,
    CircularProgress,
    TextField,
} from '@mui/material';
import { useTranslate, useLogin, useNotify, useSafeSetState } from 'ra-core';

export const LoginForm = (props: LoginFormProps) => {
    const { redirectTo } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const login = useLogin();
    const translate = useTranslate();
    const notify = useNotify();

    const validate = (values: FormData) => {
        const errors = { username: undefined, password: undefined };

        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        if (!values.password) {
            errors.password = translate('ra.validation.required');
        }
        return errors;
    };

    const submit = values => {
        setLoading(true);
        login(values, redirectTo)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
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
            });
    };

    return (
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit }) => (
                <Root onSubmit={handleSubmit} noValidate>
                    <div className={LoginFormClasses.form}>
                        <div className={LoginFormClasses.input}>
                            <Field
                                autoFocus
                                id="username"
                                name="username"
                                component={Input}
                                label={translate('ra.auth.username')}
                                disabled={loading}
                            />
                        </div>
                        <div className={LoginFormClasses.input}>
                            <Field
                                id="password"
                                name="password"
                                component={Input}
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <CardActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            className={LoginFormClasses.button}
                        >
                            {loading && (
                                <CircularProgress
                                    className={LoginFormClasses.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button>
                    </CardActions>
                </Root>
            )}
        />
    );
};

const PREFIX = 'RaLoginForm';

export const LoginFormClasses = {
    form: `${PREFIX}-form`,
    input: `${PREFIX}-input`,
    button: `${PREFIX}-button`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('form', { name: 'RaLoginForm' })(({ theme }) => ({
    [`& .${LoginFormClasses.form}`]: {
        padding: '0 1em 1em 1em',
    },

    [`& .${LoginFormClasses.input}`]: {
        marginTop: '1em',
    },

    [`& .${LoginFormClasses.button}`]: {
        width: '100%',
    },

    [`& .${LoginFormClasses.icon}`]: {
        marginRight: theme.spacing(1),
    },
}));

export interface LoginFormProps {
    redirectTo?: string;
}

interface FormData {
    username: string;
    password: string;
}

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
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

LoginForm.propTypes = {
    redirectTo: PropTypes.string,
};
