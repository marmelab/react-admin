import React from 'react';
import { LinearProgress as Progress } from 'material-ui/Progress';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = theme => ({
    root: {
        margin: `${theme.spacing.unit}px 0`,
        width: `${theme.spacing.unit * 20}px`,
    },
});

/**
 * Progress bar formatted to replace an input or a field in a form layout
 * 
 * Avoids visual jumps when replaced by value or form input
 * 
 * @see ReferenceField
 * @see ReferenceInput
 * 
 * @param {object} classes CSS class names injected by withStyles 
 */
export const LinearProgress = ({ classes, className, ...rest }) => (
    <Progress className={classnames(classes.root, className)} {...rest} />
);
LinearProgress.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default withStyles(styles)(LinearProgress);
