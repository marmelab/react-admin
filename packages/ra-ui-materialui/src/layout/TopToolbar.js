import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(1),
            minHeight: theme.spacing(5),
            [theme.breakpoints.up('xs')]: {
                paddingLeft: 0,
                paddingRight: 0,
            },
            [theme.breakpoints.down('sm')]: {
                paddingRight: theme.spacing(2),
            },
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
            },
        },
    }),
    { name: 'RaTopToolbar' }
);

const TopToolbar = props => {
    const { className, children, ...rest } = props;
    const classes = useStyles(props);
    return (
        <Toolbar className={classnames(classes.root, className)} {...rest}>
            {children}
        </Toolbar>
    );
};

TopToolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default TopToolbar;
