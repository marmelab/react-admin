import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { userLogin, ReduxState, useTranslate } from 'ra-core';

interface Props {
    redirectTo?: string;
}

interface FormData {
    username: string;
    password: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
    button: {
        width: '100%',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

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

const LoginForm: SFC<Props> = ({ redirectTo }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(
        (state: ReduxState) => state.admin.loading > 0
    );
    const translate = useTranslate();
    const classes = useStyles({});

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
        dispatch(userLogin(values, redirectTo));
    };

    return (
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            <Field
                                autoFocus
                                id="username"
                                name="username"
                                component={Input}
                                label={translate('ra.auth.username')}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="password"
                                name="password"
                                component={Input}
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <CardActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={submitting || isLoading}
                            className={classes.button}
                        >
                            {isLoading && (
                                <CircularProgress
                                    className={classes.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button>
                    </CardActions>
                </form>
            )}
        />
    );
};

LoginForm.propTypes = {
    redirectTo: PropTypes.string,
};

export default LoginForm;
