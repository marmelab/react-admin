import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import CardContent from '@mui/material/CardContent';

/**
 * Overrides Material UI CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
export const CardContentInner = (props: CardContentInnerProps): JSX.Element => {
    const { className, children } = props;

    return <Root className={className}>{children}</Root>;
};

export interface CardContentInnerProps {
    className?: string;
    children: ReactNode;
}

const PREFIX = 'RaCardContentInner';

export const CardContentInnerClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(CardContent, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    paddingTop: 0,
    paddingBottom: 0,
    '&:first-of-type': {
        paddingTop: 16,
    },
    '&:last-child': {
        paddingBottom: 16,
        [theme.breakpoints.only('xs')]: {
            paddingBottom: 70,
        },
    },
}));
