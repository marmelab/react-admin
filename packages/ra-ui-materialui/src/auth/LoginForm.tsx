import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
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
    const { control, handleSubmit } = useForm();

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
        <Root onSubmit={handleSubmit(submit)} noValidate>
            <div className={LoginFormClasses.form}>
                <div className={LoginFormClasses.input}>
                    <Controller
                        control={control}
                        name="username"
                        defaultValue=""
                        rules={{
                            validate: value =>
                                !value
                                    ? translate('ra.validation.required')
                                    : undefined,
                        }}
                        render={({
                            field,
                            fieldState: { isTouched, error },
                        }) => (
                            <TextField
                                autoFocus
                                id="username"
                                label={translate('ra.auth.username')}
                                disabled={loading}
                                helperText={isTouched && error}
                                error={!!(isTouched && error)}
                                fullWidth
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className={LoginFormClasses.input}>
                    <Controller
                        control={control}
                        name="password"
                        defaultValue=""
                        rules={{
                            validate: value =>
                                !value
                                    ? translate('ra.validation.required')
                                    : undefined,
                        }}
                        render={({
                            field,
                            fieldState: { isTouched, error },
                        }) => (
                            <TextField
                                autoFocus
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={loading}
                                label={translate('ra.auth.password')}
                                helperText={isTouched && error}
                                error={!!(isTouched && error)}
                                fullWidth
                                {...field}
                            />
                        )}
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

LoginForm.propTypes = {
    redirectTo: PropTypes.string,
};
