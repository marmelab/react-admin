import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: theme.spacing(4),
    },
}));

const NodeActions = ({ children, ...props }) => {
    const classes = useStyles();

    return (
        <span className={classes.root}>
            {Children.map(children, action =>
                action ? cloneElement(action, props) : null
            )}
        </span>
    );
};

NodeActions.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    record: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
};

export default NodeActions;
