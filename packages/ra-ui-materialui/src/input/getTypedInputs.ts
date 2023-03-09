import { ComponentType } from 'react';
import { Call, Objects } from 'hotscript';
import { OptionTextElement, OptionTextFunc, RaRecord } from 'ra-core';
import { ArrayInput, ArrayInputProps } from './ArrayInput';
import {
    AutocompleteArrayInput,
    AutocompleteArrayInputProps,
} from './AutocompleteArrayInput';
import { AutocompleteInput, AutocompleteInputProps } from './AutocompleteInput';
import { BooleanInput, BooleanInputProps } from './BooleanInput';
import {
    CheckboxGroupInput,
    CheckboxGroupInputProps,
} from './CheckboxGroupInput';
import { DateInput, DateInputProps } from './DateInput';
import { DateTimeInput, DateTimeInputProps } from './DateTimeInput';
import { FileInput, FileInputProps } from './FileInput';
import { ImageInput, ImageInputProps } from './ImageInput';
import {
    NullableBooleanInput,
    NullableBooleanInputProps,
} from './NullableBooleanInput';
import { NumberInput, NumberInputProps } from './NumberInput';
import { PasswordInput, PasswordInputProps } from './PasswordInput';
import {
    RadioButtonGroupInput,
    RadioButtonGroupInputProps,
} from './RadioButtonGroupInput';
import {
    ReferenceArrayInput,
    ReferenceArrayInputProps,
} from './ReferenceArrayInput';

export const getTypedInputs = <TRecord extends RaRecord>() => ({
    ArrayInput: ArrayInput as ComponentType<
        ArrayInputProps & TypedInputProps<TRecord>
    >,
    AutocompleteArrayInput: AutocompleteArrayInput as ComponentType<
        AutocompleteArrayInputProps &
            TypedInputProps<TRecord> &
            TypedChoicesInputProps<TRecord>
    >,
    AutocompleteInput: AutocompleteInput as ComponentType<
        AutocompleteInputProps &
            TypedInputProps<TRecord> &
            TypedChoicesInputProps<TRecord>
    >,
    BooleanInput: (BooleanInput as unknown) as ComponentType<
        BooleanInputProps & TypedInputProps<TRecord>
    >,
    CheckboxGroupInput: CheckboxGroupInput as ComponentType<
        CheckboxGroupInputProps &
            TypedInputProps<TRecord> &
            TypedChoicesInputProps<TRecord>
    >,
    DateInput: (DateInput as unknown) as ComponentType<
        DateInputProps & TypedInputProps<TRecord>
    >,
    DateTimeInput: (DateTimeInput as unknown) as ComponentType<
        DateTimeInputProps & TypedInputProps<TRecord>
    >,
    FileInput: (FileInput as unknown) as ComponentType<
        FileInputProps & TypedInputProps<TRecord>
    >,
    ImageInput: (ImageInput as unknown) as ComponentType<
        ImageInputProps & TypedInputProps<TRecord>
    >,
    NullableBooleanInput: (NullableBooleanInput as unknown) as ComponentType<
        NullableBooleanInputProps & TypedInputProps<TRecord>
    >,
    NumberInput: (NumberInput as unknown) as ComponentType<
        NumberInputProps & TypedInputProps<TRecord>
    >,
    PasswordInput: (PasswordInput as unknown) as ComponentType<
        PasswordInputProps & TypedInputProps<TRecord>
    >,
    RadioButtonGroupInput: (RadioButtonGroupInput as unknown) as ComponentType<
        RadioButtonGroupInputProps & TypedInputProps<TRecord>
    >,
    ReferenceArrayInput: (ReferenceArrayInput as unknown) as ComponentType<
        ReferenceArrayInputProps & TypedInputProps<TRecord>
    >,
});

export interface TypedInputProps<TRecord extends RaRecord> {
    source: Call<Objects.AllPaths, TRecord>;
}

export interface TypedChoicesInputProps<TRecord extends RaRecord> {
    optionText:
        | Call<Objects.AllPaths, TRecord>
        | OptionTextElement
        | OptionTextFunc<TRecord>;
    optionValue: Call<Objects.AllPaths, TRecord>;
}

export interface TypedManyInputProps<TRecord extends RaRecord> {
    target: Call<Objects.AllPaths, TRecord>;
}
