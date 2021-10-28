import { ReactElement } from 'react';
import { InputProps as BaseInputProps } from 'ra-core';

export type InputProps<ElementType = unknown> = BaseInputProps<ElementType> & {
    disabled?: boolean;
    fullWidth?: boolean;
    helperText?: string | boolean;
    label?: string | ReactElement | false;
    margin?: 'none' | 'normal' | 'dense';
    variant?: 'standard' | 'outlined' | 'filled';
};
