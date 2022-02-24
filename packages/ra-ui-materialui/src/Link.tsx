import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { styled, Link as MuiLink } from '@mui/material';

export const Link = (props: LinkProps) => {
    const { to, children, className, ...rest } = props;

    return (
        <StyledLink
            to={to}
            className={clsx(LinkClasses.link, className)}
            {...rest}
        >
            {children}
        </StyledLink>
    );
};

const PREFIX = 'RaLink';

export const LinkClasses = {
    link: `${PREFIX}-link`,
};

const MuiRouterLink = (props: RRLinkProps) => (
    <MuiLink component={RRLink} {...props} />
);

const StyledLink = styled(MuiRouterLink)(({ theme }) => ({
    [`&.${LinkClasses.link}`]: {
        textDecoration: 'none',
    },
}));

export interface LinkProps extends RRLinkProps {
    className?: string;
}

Link.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
