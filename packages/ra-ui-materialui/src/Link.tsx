import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles';

const useStyles = makeStyles(
    theme => ({
        link: {
            textDecoration: 'none',
            color: theme.palette.primary.main,
        },
    }),
    { name: 'RaLink' }
);

type LinkClassKey = 'link';

export interface LinkProps extends RRLinkProps {
    classes?: Partial<ClassNameMap<LinkClassKey>>;
    className?: string;
}

const Link = (props: LinkProps) => {
    const {
        to,
        children,
        classes: classesOverride,
        className,
        ...rest
    } = props;
    const classes = useStyles(props);
    return (
        <RRLink
            to={to}
            className={classNames(classes.link, className)}
            {...rest}
        >
            {children}
        </RRLink>
    );
};

Link.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Link;
