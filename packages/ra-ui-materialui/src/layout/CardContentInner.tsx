import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import type { ReactNode } from 'react';
import CardContent from '@mui/material/CardContent';

/**
 * Overrides Material UI CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
export const CardContentInner = (inProps: CardContentInnerProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaCardContentInner: 'root';
    }

    interface ComponentsPropsList {
        RaCardContentInner: Partial<CardContentInnerProps>;
    }

    interface Components {
        RaCardContentInner?: {
            defaultProps?: ComponentsPropsList['RaCardContentInner'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaCardContentInner'];
        };
    }
}
