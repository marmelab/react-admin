import * as React from 'react';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslate } from 'ra-core';

export const AuthError = (props: AuthErrorProps) => {
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
            </div>
        </Root>
    );
};

AuthError.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
};

export interface AuthErrorProps {
    className?: string;
    title?: string;
    message?: string;
    sx?: SxProps;
}

const PREFIX = 'RaAuthError';

export const AuthErrorClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
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

    [`& .${AuthErrorClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${AuthErrorClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        opacity: 0.5,
        margin: '0 1em',
    },
}));
