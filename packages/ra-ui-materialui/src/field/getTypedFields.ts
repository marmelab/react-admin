import { ComponentType } from 'react';
import { Call, Objects } from 'hotscript';
import { OptionTextElement, OptionTextFunc, RaRecord } from 'ra-core';
import { ArrayField, ArrayFieldProps } from './ArrayField';
import { BooleanField, BooleanFieldProps } from './BooleanField';
import { ChipField, ChipFieldProps } from './ChipField';
import { DateField, DateFieldProps } from './DateField';
import { EmailField, EmailFieldProps } from './EmailField';
import { FileField, FileFieldProps } from './FileField';
import { FunctionField, FunctionFieldProps } from './FunctionField';
import { ImageField, ImageFieldProps } from './ImageField';
import { NumberField, NumberFieldProps } from './NumberField';
import {
    ReferenceArrayField,
    ReferenceArrayFieldProps,
} from './ReferenceArrayField';
import { ReferenceField, ReferenceFieldProps } from './ReferenceField';
import {
    ReferenceManyCount,
    ReferenceManyCountProps,
} from './ReferenceManyCount';
import {
    ReferenceManyField,
    ReferenceManyFieldProps,
} from './ReferenceManyField';
import { RichTextField, RichTextFieldProps } from './RichTextField';
import { SelectField, SelectFieldProps } from './SelectField';
import { TextField, TextFieldProps } from './TextField';
import { UrlField, UrlFieldProps } from './UrlField';

export const getTypedFields = <TRecord extends RaRecord>() => ({
    ArrayField: ArrayField as ComponentType<
        ArrayFieldProps & TypedFieldProps<TRecord>
    >,
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
    FileField: FileField as ComponentType<
        FileFieldProps & TypedFieldProps<TRecord>
    >,
    FunctionField: FunctionField as ComponentType<
        FunctionFieldProps<TRecord> &
            Omit<TypedFieldProps<TRecord>, 'source'> &
            Partial<Pick<TypedFieldProps<TRecord>, 'source'>>
    >,
    ImageField: ImageField as ComponentType<
        ImageFieldProps & TypedFieldProps<TRecord>
    >,
    NumberField: NumberField as ComponentType<
        NumberFieldProps & TypedFieldProps<TRecord>
    >,
    ReferenceArrayField: ReferenceArrayField as ComponentType<
        ReferenceArrayFieldProps & TypedFieldProps<TRecord>
    >,
    ReferenceField: ReferenceField as ComponentType<
        ReferenceFieldProps & TypedFieldProps<TRecord>
    >,
    ReferenceManyCount: ReferenceManyCount as ComponentType<
        ReferenceManyCountProps & TypedManyFieldProps<TRecord>
    >,
    ReferenceManyField: ReferenceManyField as ComponentType<
        ReferenceManyFieldProps & TypedManyFieldProps<TRecord>
    >,
    RichTextField: RichTextField as ComponentType<
        RichTextFieldProps & TypedFieldProps<TRecord>
    >,
    SelectField: SelectField as ComponentType<
        SelectFieldProps &
            TypedFieldProps<TRecord> &
            TypedChoicesFieldProps<TRecord>
    >,
    TextField: TextField as ComponentType<
        TextFieldProps & TypedFieldProps<TRecord>
    >,
    UrlField: UrlField as ComponentType<
        UrlFieldProps & TypedFieldProps<TRecord>
    >,
});

export interface TypedFieldProps<TRecord extends RaRecord> {
    source: Call<Objects.AllPaths, TRecord>;
    sortBy?: Call<Objects.AllPaths, TRecord>;
}

export interface TypedChoicesFieldProps<TRecord extends RaRecord> {
    optionText?:
        | Call<Objects.AllPaths, TRecord>
        | OptionTextElement
        | OptionTextFunc<TRecord>;
    optionValue?: Call<Objects.AllPaths, TRecord>;
}

export interface TypedManyFieldProps<TRecord extends RaRecord> {
    sortBy?: Call<Objects.AllPaths, TRecord>;
    target: Call<Objects.AllPaths, TRecord>;
}
