import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
} from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';

import defaultTheme from '../defaultTheme';
import Notification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

const styles = theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '1px',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    array,
    backgroundImage,
    classes,
    className,
    location,
    staticContext,
    theme,
    title,
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
class Login extends Component {
    constructor(props) {
        super(props);
        this.theme = createMuiTheme(props.theme);
        this.containerRef = React.createRef();
    }

    // Load background image asynchronously to speed up time to interactive
    lazyLoadBackgroundImage() {
        const { backgroundImage } = this.props;
        const img = new Image();
        img.onload = () => {
            this.containerRef.current.style.background = `url(${backgroundImage})`;
        };
        img.src = backgroundImage;
    }

    componentDidMount() {
        this.lazyLoadBackgroundImage();
    }

    render() {
        const { classes, className, loginForm, ...rest } = this.props;

        return (
            <MuiThemeProvider theme={this.theme}>
                <div
                    className={classnames(classes.main, className)}
                    {...sanitizeRestProps(rest)}
                    ref={this.containerRef}
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
            </MuiThemeProvider>
        );
    }
}

Login.propTypes = {
    authProvider: PropTypes.func,
    backgroundImage: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object,
    loginForm: PropTypes.element,
    meta: PropTypes.object,
    previousRoute: PropTypes.string,
};

Login.defaultProps = {
    backgroundImage: 'https://source.unsplash.com/random/1600x900/daily',
    theme: defaultTheme,
    loginForm: <DefaultLoginForm />,
};

export default withStyles(styles)(Login);
