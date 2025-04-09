import * as React from 'react';
import { Card, styled, Theme } from '@mui/material';
import { MUIStyledCommonProps } from '@mui/system';
import clsx from 'clsx';

export const AuthLayout = ({
    children,
    className,
    ...props
}: AuthLayoutProps) => (
    <Root className={clsx(AuthLayoutClasses.root, className)} {...props}>
        <Card className={AuthLayoutClasses.card}>{children}</Card>
    </Root>
);

export interface AuthLayoutProps
    extends MUIStyledCommonProps<Theme>,
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
        > {}

const PREFIX = 'RaAuthLayout';
export const AuthLayoutClasses = {
    root: `${PREFIX}-root`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
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

    [`& .${AuthLayoutClasses.card}`]: {
        minWidth: 300,
        marginTop: '6em',
    },
}));
