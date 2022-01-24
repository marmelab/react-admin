import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, CardActions, CircularProgress } from '@mui/material';
import {
    Form,
    required,
    useTranslate,
    useLogin,
    useNotify,
    useSafeSetState,
} from 'ra-core';
import { TextInput } from '../input';

export const LoginForm = (props: LoginFormProps) => {
    const { redirectTo } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const login = useLogin();
    const translate = useTranslate();
    const notify = useNotify();

    const submit = (values: FormData) => {
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
            onSubmit={submit}
            mode="onChange"
            render={({ handleSubmit }) => (
                <Root onSubmit={handleSubmit} noValidate>
                    <div className={LoginFormClasses.form}>
                        <div className={LoginFormClasses.input}>
                            <TextInput
                                autoFocus
                                source="username"
                                label={translate('ra.auth.username')}
                                disabled={loading}
                                validate={required()}
                                fullWidth
                            />
                        </div>
                        <div className={LoginFormClasses.input}>
                            <TextInput
                                source="password"
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                                validate={required()}
                                fullWidth
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
LoginForm.propTypes = {
    redirectTo: PropTypes.string,
};
