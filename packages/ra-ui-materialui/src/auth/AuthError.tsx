import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslate } from 'ra-core';
import { Button } from '../button';
import { Link } from 'react-router-dom';

export const AuthError = (inProps: AuthErrorProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        title = 'ra.page.error',
        message = 'ra.message.auth_error',
        ...rest
    } = props;

    const translate = useTranslate();
    return (
        <Root className={className} {...rest}>
            <div className={AuthErrorClasses.message}>
                <h1>{translate(title, { _: title })}</h1>
                <div>{translate(message, { _: message })}</div>
                <Button component={Link} to="/login" label="ra.auth.sign_in">
                    <LockIcon />
                </Button>
            </div>
        </Root>
    );
};

export interface AuthErrorProps {
    className?: string;
    title?: string;
    message?: string;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaAuthError';

export const AuthErrorClasses = {
    root: `${PREFIX}-root`,
    message: `${PREFIX}-message`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
        height: '100%',
    },
    [theme.breakpoints.down('xl')]: {
        height: '100vh',
        marginTop: '-3em',
    },

    [`& .${AuthErrorClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaAuthError: 'root' | 'message';
    }

    interface ComponentsPropsList {
        RaAuthError: Partial<AuthErrorProps>;
    }

    interface Components {
        RaAuthError?: {
            defaultProps?: ComponentsPropsList['RaAuthError'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaAuthError'];
        };
    }
}
