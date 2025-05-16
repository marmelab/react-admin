import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    Box,
    LinearProgress as MuiLinearProgress,
    type LinearProgressProps as ProgressProps,
} from '@mui/material';
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
export const LinearProgress = (inProps: LinearProgressProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { className, timeout = 1000, ...rest } = props;

    const oneSecondHasPassed = useTimeout(timeout);

    return oneSecondHasPassed ? (
        <StyledProgress className={className} {...rest} />
    ) : (
        <Box
            component="span"
            sx={{
                my: 1,
                height: 4,
                display: 'block',
            }}
        />
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
LinearProgress.displayName = 'LinearProgress';

export interface LinearProgressProps extends ProgressProps {
    timeout?: number;
}

const PREFIX = 'RaLinearProgress';

const StyledProgress = styled(MuiLinearProgress, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    margin: `${theme.spacing(1)} 0`,
    width: theme.spacing(20),
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLinearProgress: 'root';
    }

    interface ComponentsPropsList {
        RaLinearProgress: Partial<LinearProgressProps>;
    }

    interface Components {
        RaLinearProgress?: {
            defaultProps?: ComponentsPropsList['RaLinearProgress'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLinearProgress'];
        };
    }
}
