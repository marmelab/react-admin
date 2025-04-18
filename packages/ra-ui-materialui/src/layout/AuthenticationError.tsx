import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { Typography } from '@mui/material';
import WarningAmber from '@mui/icons-material/WarningAmber';
import clsx from 'clsx';
import { useDefaultTitle, useTranslate } from 'ra-core';
import { Title } from './Title';

export const AuthenticationError = (inProps: AuthenticationErrorProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        icon = DEFAULT_ICON,
        textPrimary = 'ra.page.authentication_error',
        textSecondary = 'ra.message.authentication_error',
        ...rest
    } = props;

    const translate = useTranslate();
    const title = useDefaultTitle();
    return (
        <Root
            className={clsx(AuthenticationErrorClasses.root, className)}
            {...rest}
        >
            <Title defaultTitle={title} />
            <div className={AuthenticationErrorClasses.message}>
                {icon}
                <Typography
                    variant="h5"
                    sx={{
                        mt: 3,
                        color: 'text.secondary',
                    }}
                >
                    {translate(textPrimary, { _: textPrimary })}
                </Typography>
                <Typography variant="body2">
                    {translate(textSecondary, { _: textSecondary })}
                </Typography>
            </div>
        </Root>
    );
};

export interface AuthenticationErrorProps {
    className?: string;
    textPrimary?: string;
    textSecondary?: string;
    icon?: React.ReactNode;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaAuthenticationError';

export const AuthenticationErrorClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',

    [`& .${AuthenticationErrorClasses.message}`]: {
        textAlign: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
        opacity: 0.5,
    },

    [`& .${AuthenticationErrorClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
});

const DEFAULT_ICON = (
    <WarningAmber className={AuthenticationErrorClasses.icon} />
);

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaAuthenticationError: 'root' | 'icon' | 'message';
    }

    interface ComponentsPropsList {
        RaAuthenticationError: Partial<AuthenticationErrorProps>;
    }

    interface Components {
        RaAuthenticationError?: {
            defaultProps?: ComponentsPropsList['RaAuthenticationError'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaAuthenticationError'];
        };
    }
}
