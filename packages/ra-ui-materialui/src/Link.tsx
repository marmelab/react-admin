import * as React from 'react';
import clsx from 'clsx';
import {
    Link as RRLink,
    type LinkProps as RRLinkProps,
} from 'react-router-dom';
import {
    styled,
    Link as MuiLink,
    type LinkProps as MuiLinkProps,
    type ComponentsOverrides,
    useThemeProps,
} from '@mui/material';

export const Link = (inProps: LinkProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { to, children, className, ...rest } = props;

    return (
        <StyledMuiLink
            component={RRLink}
            to={to}
            className={clsx(LinkClasses.link, className)}
            {...rest}
        >
            {children}
        </StyledMuiLink>
    );
};

const PREFIX = 'RaLink';

export const LinkClasses = {
    link: `${PREFIX}-link`,
};

const StyledMuiLink = styled(MuiLink, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({}) as typeof MuiLink; // @see https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop

// @see https://mui.com/material-ui/guides/composition/#with-typescript
export interface LinkProps
    extends MuiLinkProps<React.ElementType<any>, RRLinkProps> {
    className?: string;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<LinkProps>;
    }

    interface Components {
        RaLink?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
