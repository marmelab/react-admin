import * as React from 'react';
import { styled } from '@mui/material/styles';
import WarningAmber from '@mui/icons-material/WarningAmber';
import clsx from 'clsx';

import { useDefaultTitle, useTranslate } from 'ra-core';
import { Title } from './Title';

export const AuthenticationError = props => {
    const { className, ...rest } = props;

    const translate = useTranslate();
    const title = useDefaultTitle();
    return (
        <Root
            className={clsx(AuthenticationErrorClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Title defaultTitle={title} />
            <div className={AuthenticationErrorClasses.message}>
                <WarningAmber className={AuthenticationErrorClasses.icon} />
                <h1>{translate('ra.page.authentication_error')}</h1>
                <div>{translate('ra.message.authentication_error')}.</div>
            </div>
        </Root>
    );
};

const sanitizeRestProps = ({
    staticContext,
    history,
    location,
    match,
    ...rest
}) => rest;

const PREFIX = 'RaAuthenticationError';

export const AuthenticationErrorClasses = {
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
    [theme.breakpoints.down('md')]: {
        height: '100vh',
        marginTop: '-3em',
    },

    [`& .${AuthenticationErrorClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${AuthenticationErrorClasses.message}`]: {
        textAlign: 'center',
        opacity: 0.5,
        margin: '0 1em',
    },
}));
