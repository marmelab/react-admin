import * as React from 'react';
import { CircularProgress, InputAdornment } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';
import { useTimeout } from 'ra-core';

import { ResettableTextField } from './ResettableTextField';

/**
 * An input placeholder with a loading indicator
 *
 * Avoids visual jumps when replaced by a form input
 */
export const LoadingInput = ({
    fullWidth,
    label,
    helperText,
    margin,
    size,
    sx,
    timeout = 1000,
    variant,
}: LoadingInputProps) => {
    const oneSecondHasPassed = useTimeout(timeout);

    return (
        <StyledResettableTextField
            sx={sx}
            label={label}
            helperText={helperText}
            fullWidth={fullWidth}
            variant={variant}
            margin={margin}
            size={size}
            disabled
            onChange={() => {}}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {oneSecondHasPassed ? (
                            <CircularProgress color="inherit" size={20} />
                        ) : (
                            // use an adornment of the same size to avoid visual jumps
                            <span style={{ width: 20 }}>&nbsp;</span>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};

const PREFIX = 'RaLoadingInput';

// make it look just like a regular input, even though it's disabled
// because the loading indicator is enough
const StyledResettableTextField = styled(ResettableTextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    '& .MuiInputLabel-root.Mui-disabled': {
        color: theme.palette.text.secondary,
    },
    '& .MuiFilledInput-root.Mui-disabled': {
        background:
            theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.04)'
                : 'rgba(255, 255, 255, 0.09)',
    },
    '& .MuiFilledInput-root.Mui-disabled:before': {
        borderBottomStyle: 'solid',
    },
}));

export interface LoadingInputProps {
    fullWidth?: boolean;
    helperText?: React.ReactNode;
    margin?: 'normal' | 'none' | 'dense';
    label?: string | React.ReactElement | false;
    sx?: SxProps;
    size?: 'medium' | 'small';
    timeout?: number;
    variant?: 'standard' | 'filled' | 'outlined';
}
