import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import LockIcon from 'material-ui-icons/LockOutline';
import { withStyles } from 'material-ui/styles';

import defaultTheme from '../defaultTheme';
import Notification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

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
});

const sanitizeRestProps = ({
    classes,
    className,
    location,
    title,
    array,
    theme,
    staticContext,
    ...rest
}) => rest;

/**
 * A standalone login page, to serve as authentication gate to the admin
 *
 * Expects the user to enter a login and a password, which will be checked
 * by the `authProvider` using the AUTH_LOGIN verb. Redirects to the root page
 * (/) upon success, otherwise displays an authentication error message.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to authenticate via email or facebook or anything else).
 *
 * @example
 *     import MyLoginPage from './MyLoginPage';
 *     const App = () => (
 *         <Admin loginPage={MyLoginPage} authProvider={authProvider}>
 *             ...
 *        </Admin>
 *     );
 */
const Login = ({
    classes,
    className,
    loginForm = <DefaultLoginForm />,
    ...rest
}) => (
    <div
        className={classnames(classes.main, className)}
        {...sanitizeRestProps(rest)}
    >
        <Card className={classes.card}>
            <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                    <LockIcon />
                </Avatar>
            </div>
            {loginForm}
        </Card>
        <Notification />
    </div>
);

Login.propTypes = {
    className: PropTypes.string,
    authProvider: PropTypes.func,
    classes: PropTypes.object,
    input: PropTypes.object,
    meta: PropTypes.object,
    previousRoute: PropTypes.string,
    loginForm: PropTypes.func,
};

Login.defaultProps = {
    theme: defaultTheme,
};

export default withStyles(styles)(Login);
