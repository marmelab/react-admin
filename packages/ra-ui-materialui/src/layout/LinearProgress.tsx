import * as React from 'react';
import Progress, {
    LinearProgressProps as ProgressProps,
} from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useTimeout } from 'ra-core';

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
 * @typedef {Object} Props the props you can use
 * @prop {Object} classes CSS class names
 * @prop {string} className CSS class applied to the LinearProgress component
 * @prop {integer} timeout Milliseconds to wait before showing the progress bar. One second by default
 *
 * @param {Props} props
 */
const LinearProgress = ({ timeout = 1000, ...props }: LinearProgressProps) => {
    const { classes: classesOverride, className, ...rest } = props;
    const classes = useStyles(props);
    const oneSecondHasPassed = useTimeout(timeout);

    return oneSecondHasPassed ? (
        <Progress className={classnames(classes.root, className)} {...rest} />
    ) : null;
};

LinearProgress.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    timeout: PropTypes.number,
};

// What? TypeScript loses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export interface LinearProgressProps extends ProgressProps {
    timeout?: number;
}

export default LinearProgress;
