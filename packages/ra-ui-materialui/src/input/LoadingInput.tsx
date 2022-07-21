import * as React from 'react';
import { CircularProgress } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';
import { useInput, FieldTitle, useTimeout } from 'ra-core';

import { ResettableTextField } from './ResettableTextField';

/**
 * An input placeholder with a loading indicator
 *
 * Avoids visual jumps when replaced by a form input
 */
export const LoadingInput = ({
    label,
    resource,
    source,
    timeout = 1000,
    validate,
    sx,
}: LoadingInputProps) => {
    const oneSecondHasPassed = useTimeout(timeout);

    const { isRequired } = useInput({
        resource,
        source,
        validate,
    });

    return (
        <StyledResettableTextField
            sx={sx}
            label={
                label !== '' &&
                label !== false && (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                )
            }
            disabled
            onChange={() => {}}
            InputProps={{
                endAdornment: oneSecondHasPassed ? (
                    <CircularProgress color="inherit" size={20} />
                ) : (
                    // use an adornment of the same size to avoid visual jumps
                    <span style={{ width: 20 }}>&nbsp;</span>
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
    label?: string | React.ReactElement | false;
    resource?: string;
    source?: string;
    timeout?: number;
    validate?: any;
    sx?: SxProps;
}
