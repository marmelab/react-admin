import { InputProps } from 'ra-core';

export type CommonInputProps = InputProps & {
    cellClassName?: string;
    /*
     * @deprecated this property is not used anymore
     */
    formClassName?: string;
    disabled?: boolean;
    readOnly?: boolean;
    fullWidth?: boolean;
    headerCellClassName?: string;
    margin?: 'none' | 'dense' | 'normal';
    variant?: 'standard' | 'outlined' | 'filled';
};
