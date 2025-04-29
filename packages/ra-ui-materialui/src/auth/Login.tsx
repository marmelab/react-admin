import * as React from 'react';
import {
    type HtmlHTMLAttributes,
    type ReactNode,
    useRef,
    useEffect,
} from 'react';
import { Card, Avatar, type SxProps } from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useCheckAuth } from 'ra-core';

import { LoginForm as DefaultLoginForm } from './LoginForm';

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
export const Login = (inProps: LoginProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children = defaultLoginForm,
        backgroundImage,
        avatarIcon = defaultAvatarIcon,
        ...rest
    } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    let backgroundImageLoaded = false;
    const checkAuth = useCheckAuth();
    const navigate = useNavigate();
    useEffect(() => {
        checkAuth({}, false)
            .then(() => {
                // already authenticated, redirect to the home page
                navigate('/');
            })
            .catch(() => {
                // not authenticated, stay on the login page
            });
    }, [checkAuth, navigate]);

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
        <Root {...rest} ref={containerRef}>
            <Card className={LoginClasses.card}>
                <div className={LoginClasses.avatar}>
                    <Avatar className={LoginClasses.icon}>{avatarIcon}</Avatar>
                </div>
                {children}
            </Card>
        </Root>
    );
};

const defaultLoginForm = <DefaultLoginForm />;

const defaultAvatarIcon = <LockIcon />;

export interface LoginProps extends HtmlHTMLAttributes<HTMLDivElement> {
    avatarIcon?: ReactNode;
    backgroundImage?: string;
    children?: ReactNode;
    className?: string;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaLogin';
export const LoginClasses = {
    card: `${PREFIX}-card`,
    avatar: `${PREFIX}-avatar`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
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

    [`& .${LoginClasses.card}`]: {
        minWidth: 300,
        marginTop: '6em',
    },
    [`& .${LoginClasses.avatar}`]: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    [`& .${LoginClasses.icon}`]: {
        backgroundColor: (theme.vars || theme).palette.secondary[500],
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLogin: 'root' | 'card' | 'avatar' | 'icon';
    }

    interface ComponentsPropsList {
        RaLogin: Partial<LoginProps>;
    }

    interface Components {
        RaLogin?: {
            defaultProps?: ComponentsPropsList['RaLogin'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLogin'];
        };
    }
}
