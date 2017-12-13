import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Card, { CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import LockIcon from 'material-ui-icons/LockOutline';
import { withStyles } from 'material-ui/styles';

import defaultTheme from '../defaultTheme';
import { userLogin } from '../../actions/authActions';
import translate from '../../i18n/translate';
import Notification from '../layout/Notification';

const styles = theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url(https://source.unsplash.com/random/1600x900)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    avatar: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary[500],
    },
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
    meta: { touched, error } = {},
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

/**
 * A standalone login page, to serve as authentication gate to the admin
 *
 * Expects the user to enter a login and a password, which will be checked
 * by the `authClient` using the AUTH_LOGIN verb. Redirects to the root page
 * (/) upon success, otherwise displays an authentication error message.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to authenticate via email or facebook or anything else).
 *
 * @example
 *     import MyLoginPage from './MyLoginPage';
 *     const App = () => (
 *         <Admin loginPage={MyLoginPage} authClient={authClient}>
 *             ...
 *        </Admin>
 *     );
 */
class Login extends Component {
    login = auth =>
        this.props.userLogin(
            auth,
            this.props.location.state
                ? this.props.location.state.nextPathname
                : '/'
        );

    render() {
        const {
            classes,
            className,
            handleSubmit,
            isLoading,
            translate,
            ...rest
        } = this.props;
        return (
            <div className={classnames(classes.main, className)} {...rest}>
                <Card className={classes.card}>
                    <div className={classes.avatar}>
                        <Avatar className={classes.icon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    <form onSubmit={handleSubmit(this.login)}>
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <Field
                                    name="username"
                                    component={renderInput}
                                    label={translate('ra.auth.username')}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className={classes.input}>
                                <Field
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
                                raised
                                type="submit"
                                color="primary"
                                disabled={isLoading}
                                className={classes.button}
                            >
                                {isLoading && (
                                    <CircularProgress size={25} thickness={2} />
                                )}
                                {translate('ra.auth.sign_in')}
                            </Button>
                        </CardActions>
                    </form>
                </Card>
                <Notification />
            </div>
        );
    }
}

Login.propTypes = {
    ...propTypes,
    className: PropTypes.string,
    authClient: PropTypes.func,
    classes: PropTypes.object,
    input: PropTypes.object,
    meta: PropTypes.object,
    previousRoute: PropTypes.string,
    translate: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
};

Login.defaultProps = {
    theme: defaultTheme,
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
    translate,
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
    }),
    connect(mapStateToProps, { userLogin }),
    withStyles(styles)
);

export default enhance(Login);
