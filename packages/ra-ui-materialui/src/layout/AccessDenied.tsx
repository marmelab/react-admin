import * as React from 'react';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { Typography, SxProps } from '@mui/material';
import clsx from 'clsx';
import { useTranslate } from 'ra-core';

export const AccessDenied = (props: AccessDeniedProps) => {
    const {
        className,
        icon = DEFAULT_ICON,
        textPrimary = 'ra.page.access_denied',
        textSecondary = 'ra.message.access_denied',
        ...rest
    } = props;
    const translate = useTranslate();
    return (
        <Root className={clsx(AccessDeniedClasses.root, className)} {...rest}>
            <div className={AccessDeniedClasses.message}>
                {icon}
                <Typography variant="h5" mt={3} color="text.secondary">
                    {translate(textPrimary, { _: textPrimary })}
                </Typography>
                <Typography variant="body2">
                    {translate(textSecondary, {
                        _: textSecondary,
                    })}
                </Typography>
            </div>
        </Root>
    );
};

export interface AccessDeniedProps {
    className?: string;
    textPrimary?: string;
    textSecondary?: string;
    icon?: React.ReactNode;
    sx?: SxProps;
}

const PREFIX = 'RaAccessDenied';

export const AccessDeniedClasses = {
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
    [`& .${AccessDeniedClasses.message}`]: {
        textAlign: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
        opacity: 0.5,
    },
    [`& .${AccessDeniedClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
});

const DEFAULT_ICON = <LockIcon className={AccessDeniedClasses.icon} />;
