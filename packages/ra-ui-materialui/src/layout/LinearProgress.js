import React from 'react';
import Progress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => createStyles({
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
// wat? TypeScript looses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export default withStyles(styles)(LinearProgress);
