import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: 70,
    },
});

const Actions = ({ className, children, ...rest }) => {
    const classes = useStyles();
    return (
        <Toolbar className={classnames(classes.root, className)} {...rest}>
            {children}
        </Toolbar>
    );
};

Actions.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Actions;
