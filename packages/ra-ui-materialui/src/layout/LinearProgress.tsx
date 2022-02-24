import * as React from 'react';
import { styled } from '@mui/material/styles';
import Progress, {
    LinearProgressProps as ProgressProps,
} from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import { useTimeout } from 'ra-core';

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
export const LinearProgress = ({
    timeout = 1000,
    ...props
}: LinearProgressProps) => {
    const { className, ...rest } = props;

    const oneSecondHasPassed = useTimeout(timeout);

    return oneSecondHasPassed ? (
        <StyledProgress className={className} {...rest} />
    ) : null;
};

LinearProgress.propTypes = {
    className: PropTypes.string,
    timeout: PropTypes.number,
};

// What? TypeScript loses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export interface LinearProgressProps extends ProgressProps {
    timeout?: number;
}

const PREFIX = 'RaLinearProgress';

const StyledProgress = styled(Progress, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    margin: `${theme.spacing(1)} 0`,
    width: theme.spacing(20),
}));
