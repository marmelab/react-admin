import { InputProps } from 'ra-core';

export type CommonInputProps = InputProps & {
    cellClassName?: string;
    formClassName?: string;
    fullWidth?: boolean;
    headerCellClassName?: string;
    margin?: 'none' | 'dense' | 'normal';
    variant?: 'standard' | 'outlined' | 'filled';
};
