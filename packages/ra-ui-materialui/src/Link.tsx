import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { styled } from '@mui/material';

const PREFIX = 'RaLink';

export const LinkClasses = {
    link: `${PREFIX}-link`,
};

const StyledLink = styled(RRLink)(({ theme }) => ({
    [`& .${LinkClasses.link}`]: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
    },
}));

export interface LinkProps extends RRLinkProps {
    className?: string;
}

export const Link = (props: LinkProps) => {
    const { to, children, className, ...rest } = props;

    return (
        <StyledLink
            to={to}
            className={classNames(LinkClasses.link, className)}
            {...rest}
        >
            {children}
        </StyledLink>
    );
};

Link.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
