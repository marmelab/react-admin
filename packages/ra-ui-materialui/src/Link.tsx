import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { styled } from '@mui/material';

const PREFIX = 'RaLink';

const classes = {
    link: `${PREFIX}-link`,
};

const StyledLink = styled(RRLink)(({ theme }) => ({
    [`& .${classes.link}`]: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
    },
}));

export interface LinkProps extends RRLinkProps {
    className?: string;
}

const Link = (props: LinkProps) => {
    const { to, children, className, ...rest } = props;

    return (
        <StyledLink
            to={to}
            className={classNames(classes.link, className)}
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

export default Link;
