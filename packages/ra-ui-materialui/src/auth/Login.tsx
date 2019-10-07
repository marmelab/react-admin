import React, {
    HtmlHTMLAttributes,
    ReactNode,
    useRef,
    useEffect,
    useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    Card,
    Avatar,
    createMuiTheme,
    makeStyles,
    Theme,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import { StaticContext, useHistory } from 'react-router';
import { useCheckAuth } from 'ra-core';

import defaultTheme from '../defaultTheme';
import Notification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

interface Props {
    backgroundImage?: string;
    children: ReactNode;
    staticContext?: StaticContext;
    theme: object;
}

const useStyles = makeStyles((theme: Theme) => ({
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
}));

/**
 * A standalone login page, to serve as authentication gate to the admin
 *
 * Expects the user to enter a login and a password, which will be checked
 * by the `authProvider.login()` method. Redirects to the root page (/)
 * upon success, otherwise displays an authentication error message.
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
const Login: React.FunctionComponent<
    Props & HtmlHTMLAttributes<HTMLDivElement>
> = ({
    theme,
    className,
    children,
    staticContext,
    backgroundImage,
    ...rest
}) => {
    const containerRef = useRef<HTMLDivElement>();
    const styles = useStyles({});
    const muiTheme = useMemo(() => createMuiTheme(theme), [theme]);
    let backgroundImageLoaded = false;
    const checkAuth = useCheckAuth();
    const history = useHistory();
    useEffect(() => {
        checkAuth({}, false)
            .then(() => {
                // already authenticated, redirect to the home page
                history.push('/');
            })
            .catch(() => {
                // not authenticated, stay on the login page
            });
    }, [checkAuth, history]);

    const updateBackgroundImage = () => {
        if (!backgroundImageLoaded && containerRef.current) {
            containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
            backgroundImageLoaded = true;
        }
    };

    // Load background image asynchronously to speed up time to interactive
    const lazyLoadBackgroundImage = () => {
        if (backgroundImage) {
            const img = new Image();
            img.onload = updateBackgroundImage;
            img.src = backgroundImage;
        }
    };

    useEffect(() => {
        if (!backgroundImageLoaded) {
            lazyLoadBackgroundImage();
        }
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <div
                className={classnames(styles.main, className)}
                {...rest}
                ref={containerRef}
            >
                <Card className={styles.card}>
                    <div className={styles.avatar}>
                        <Avatar className={styles.icon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    {children}
                </Card>
                <Notification />
            </div>
        </ThemeProvider>
    );
};

Login.propTypes = {
    backgroundImage: PropTypes.string,
    children: PropTypes.node,
    theme: PropTypes.object,
    staticContext: PropTypes.object,
};

Login.defaultProps = {
    backgroundImage: 'https://source.unsplash.com/random/1600x900/daily',
    theme: defaultTheme,
    children: <DefaultLoginForm />,
};

export default Login;
