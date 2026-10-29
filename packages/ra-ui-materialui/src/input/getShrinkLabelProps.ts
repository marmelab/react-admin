import { type InputLabelProps, major as muiMajor } from '@mui/material';

/**
 * Get the TextField props that keep the label shrunk, merged with the label props passed by the user.
 *
 * Native date and time inputs always display a placeholder, which would overlap a non-shrunk label.
 */
export const getShrinkLabelProps = (
    inputLabelProps: Partial<InputLabelProps> | undefined,
    slotProps: any
) => {
    const inputLabel = {
        shrink: true,
        ...inputLabelProps,
        ...slotProps?.inputLabel,
    };
    return muiMajor >= 6
        ? { slotProps: { ...slotProps, inputLabel } }
        : { InputLabelProps: inputLabel };
};
