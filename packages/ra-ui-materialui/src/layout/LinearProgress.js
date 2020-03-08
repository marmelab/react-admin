import React from 'react';
import Progress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: `${theme.spacing(1)}px 0`,
            width: `${theme.spacing(20)}px`,
        },
    }),
    { name: 'RaLinearProgress' }
);

/**
 * Progress bar formatted to replace an input or a field in a form layout
 *
 * Avoids visual jumps when replaced by value or form input
 *
 * @see ReferenceField
 * @see ReferenceInput
 *
 * @param {object} classes CSS class names
 */
const LinearProgress = ({ classes: classesOverride, className, ...rest }) => {
    const classes = useStyles({ classes: classesOverride });
    return (
        <Progress className={classnames(classes.root, className)} {...rest} />
    );
};
LinearProgress.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
};
// wat? TypeScript looses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export default LinearProgress;
