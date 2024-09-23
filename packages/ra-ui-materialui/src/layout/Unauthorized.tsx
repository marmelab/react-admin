import * as React from 'react';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import { Typography, SxProps } from '@mui/material';
import clsx from 'clsx';
import { useTranslate } from 'ra-core';

export const Unauthorized = (props: UnauthorizedProps) => {
    const {
        className,
        icon = DEFAULT_ICON,
        unauthorizedPrimary = 'ra.page.unauthorized',
        unauthorizedSecondary = 'ra.message.unauthorized',
        ...rest
    } = props;
    const translate = useTranslate();
    return (
        <Root className={clsx(UnauthorizedClasses.root, className)} {...rest}>
            <div className={UnauthorizedClasses.message}>
                {icon}
                <Typography variant="h5" mt={3} color="text.secondary">
                    {translate(unauthorizedPrimary, { _: unauthorizedPrimary })}
                </Typography>
                <Typography variant="body2">
                    {translate(unauthorizedSecondary, {
                        _: unauthorizedSecondary,
                    })}
                </Typography>
            </div>
        </Root>
    );
};

export interface UnauthorizedProps {
    className?: string;
    unauthorizedPrimary?: string;
    unauthorizedSecondary?: string;
    icon?: React.ReactNode;
    sx?: SxProps;
}

const PREFIX = 'RaUnauthorized';

export const UnauthorizedClasses = {
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
    [`& .${UnauthorizedClasses.message}`]: {
        textAlign: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
        opacity: 0.5,
    },
    [`& .${UnauthorizedClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
});

const DEFAULT_ICON = <LockIcon className={UnauthorizedClasses.icon} />;
