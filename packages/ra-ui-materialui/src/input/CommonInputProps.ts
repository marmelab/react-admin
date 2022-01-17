import { InputProps } from 'ra-core';

export type CommonInputProps = InputProps & {
    fullWidth?: boolean;
    margin?: 'none' | 'dense' | 'normal';
    variant?: 'standard' | 'outlined' | 'filled';
};
