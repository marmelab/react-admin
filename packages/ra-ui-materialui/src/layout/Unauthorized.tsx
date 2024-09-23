import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, SxProps } from '@mui/material';
import clsx from 'clsx';
import { useTranslate } from 'ra-core';

export const Unauthorized = (props: UnauthorizedProps) => {
    const {
        className,
        unauthorizedPrimary = 'ra.page.unauthorized',
        unauthorizedSecondary = 'ra.message.unauthorized',
        ...rest
    } = props;
    const translate = useTranslate();
    return (
        <Root className={clsx(UnauthorizedClasses.root, className)} {...rest}>
            <div className={UnauthorizedClasses.message}>
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
    sx?: SxProps;
}

const PREFIX = 'RaUnauthorized';

export const UnauthorizedClasses = {
    root: `${PREFIX}-root`,
    message: `${PREFIX}-message`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    [`& .${UnauthorizedClasses.message}`]: {
        textAlign: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
    },
});
