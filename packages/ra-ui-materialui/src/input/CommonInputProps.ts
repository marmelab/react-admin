import { InputProps } from 'ra-core';

export type CommonInputProps<
    Source extends string = string,
    ValueType = any
> = InputProps<Source, ValueType> & {
    cellClassName?: string;
    /*
     * @deprecated this property is not used anymore
     */
    formClassName?: string;
    fullWidth?: boolean;
    headerCellClassName?: string;
    margin?: 'none' | 'dense' | 'normal';
    variant?: 'standard' | 'outlined' | 'filled';
};
