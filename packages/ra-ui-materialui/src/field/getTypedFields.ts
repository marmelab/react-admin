import { ComponentType } from 'react';
import { Call, Objects } from 'hotscript';
import { RaRecord } from 'ra-core';
import { BooleanField, BooleanFieldProps } from './BooleanField';
import { ChipField, ChipFieldProps } from './ChipField';
import { DateField, DateFieldProps } from './DateField';
import { EmailField, EmailFieldProps } from './EmailField';
import { FunctionField, FunctionFieldProps } from './FunctionField';

export const getTypedFields = <TRecord extends RaRecord>() => ({
    BooleanField: BooleanField as ComponentType<
        BooleanFieldProps & TypedFieldProps<TRecord>
    >,
    ChipField: ChipField as ComponentType<
        ChipFieldProps & TypedFieldProps<TRecord>
    >,
    DateField: DateField as ComponentType<
        DateFieldProps & TypedFieldProps<TRecord>
    >,
    EmailField: EmailField as ComponentType<
        EmailFieldProps & TypedFieldProps<TRecord>
    >,
    FunctionField: FunctionField as ComponentType<
        FunctionFieldProps<TRecord> & TypedFieldProps<TRecord>
    >,
});

export interface TypedFieldProps<TRecord extends RaRecord> {
    source: Call<Objects.AllPaths, TRecord>;
}
