import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import {
    styled,
    Link as MuiLink,
    LinkProps as MuiLinkProps,
} from '@mui/material';

export const Link = (props: LinkProps) => {
    const { to, children, className, ...rest } = props;

    return (
        <StyledMuiLink
            component={RRLink}
            to={to}
            className={clsx(LinkClasses.link, className)}
            underline="none"
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

const StyledMuiLink = styled(MuiLink)({}) as typeof MuiLink; // @see https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop

// @see https://mui.com/material-ui/guides/composition/#with-typescript
export interface LinkProps
    extends MuiLinkProps<React.ElementType<any>, RRLinkProps> {
    className?: string;
}

Link.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
