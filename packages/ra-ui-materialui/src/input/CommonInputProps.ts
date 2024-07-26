import { InputProps } from 'ra-core';

export type CommonInputProps = InputProps & {
    cellClassName?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    headerCellClassName?: string;
    margin?: 'none' | 'dense' | 'normal';
    readOnly?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
};
