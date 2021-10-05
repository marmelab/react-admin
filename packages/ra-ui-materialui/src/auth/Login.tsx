import React, {
    HtmlHTMLAttributes,
    ComponentType,
    createElement,
    ReactNode,
    useRef,
    useEffect,
    useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Avatar } from '@mui/material';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { StaticContext } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCheckAuth, TitleComponent } from 'ra-core';

import defaultTheme from '../defaultTheme';
import DefaultNotification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

export interface LoginProps
    extends Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    backgroundImage?: string;
    children?: ReactNode;
    classes?: object;
    className?: string;
    notification?: ComponentType;
    staticContext?: StaticContext;
    theme?: object;
    title?: TitleComponent;
}

const PREFIX = 'RaLogin';
const classes = {
    main: `${PREFIX}-main`,
    card: `${PREFIX}-card`,
    avatar: `${PREFIX}-avatar`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.main}`]: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '1px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage:
            'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
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
const Login: React.FunctionComponent<LoginProps> = props => {
    const { theme, ...rest } = props;
    const muiTheme = useMemo(() => createTheme(theme), [theme]);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
                <LoginContainer {...rest} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

const LoginContainer = props => {
    const {
        title,
        classes: classesOverride,
        className,
        children,
        notification,
        staticContext,
        backgroundImage,
        ...rest
    } = props;
    const containerRef = useRef<HTMLDivElement>();
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
        <Root
            className={classnames(classes.main, className)}
            {...rest}
            ref={containerRef}
        >
            <Card className={classes.card}>
                <div className={classes.avatar}>
                    <Avatar className={classes.icon}>
                        <LockIcon />
                    </Avatar>
                </div>
                {children}
            </Card>
            {notification ? createElement(notification) : null}
        </Root>
    );
};

Login.propTypes = {
    backgroundImage: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.object,
    staticContext: PropTypes.object,
};

Login.defaultProps = {
    theme: defaultTheme,
    children: <DefaultLoginForm />,
    notification: DefaultNotification,
};

export default Login;
