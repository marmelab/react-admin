import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { translate, userLogin } from 'ra-core';

const styles = () => ({
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
    button: {
        width: '100%',
    },
});

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({
    meta: { touched, error } = {}, // eslint-disable-line react/prop-types
    input: { ...inputProps }, // eslint-disable-line react/prop-types
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
const login = (auth, dispatch, { redirectTo }) =>
    dispatch(userLogin(auth, redirectTo));

const LoginForm = ({ classes, isLoading, handleSubmit, translate }) => (
    <form onSubmit={handleSubmit(login)}>
        <div className={classes.form}>
            <div className={classes.input}>
                <Field
                    autoFocus
                    id="username"
                    name="username"
                    component={renderInput}
                    label={translate('ra.auth.username')}
                    disabled={isLoading}
                />
            </div>
            <div className={classes.input}>
                <Field
                    id="password"
                    name="password"
                    component={renderInput}
                    label={translate('ra.auth.password')}
                    type="password"
                    disabled={isLoading}
                />
            </div>
        </div>
        <CardActions>
            <Button
                variant="raised"
                type="submit"
                color="primary"
                disabled={isLoading}
                className={classes.button}
            >
                {isLoading && <CircularProgress size={25} thickness={2} />}
                {translate('ra.auth.sign_in')}
            </Button>
        </CardActions>
    </form>
);
LoginForm.propTypes = {
    ...propTypes,
    classes: PropTypes.object,
    redirectTo: PropTypes.string,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
    withStyles(styles),
    translate,
    connect(mapStateToProps),
    reduxForm({
        form: 'signIn',
        validate: (values, props) => {
            const errors = {};
            const { translate } = props;
            if (!values.username)
                errors.username = translate('ra.validation.required');
            if (!values.password)
                errors.password = translate('ra.validation.required');
            return errors;
        },
    })
);

export default enhance(LoginForm);
