import * as React from 'react';
import {
    ArrayField as RaArrayField,
    ArrayFieldProps,
    BooleanField as RaBooleanField,
    BooleanFieldProps,
    ChipField as RaChipField,
    ChipFieldProps,
    NumberField as RaNumberField,
    NumberFieldProps,
    DateField as RaDateField,
    DateFieldProps,
    EmailField as RaEmailField,
    EmailFieldProps,
    FileField as RaFileField,
    FileFieldProps,
    FunctionField as RaFunctionField,
    FunctionFieldProps,
    ImageField as RaImageField,
    ImageFieldProps,
    ReferenceArrayField as RaReferenceArrayField,
    ReferenceArrayFieldProps,
    ReferenceField as RaReferenceField,
    ReferenceFieldProps,
    ReferenceManyCount as RaReferenceManyCount,
    ReferenceManyCountProps,
    ReferenceManyField as RaReferenceManyField,
    ReferenceManyFieldProps,
    RichTextField as RaRichTextField,
    RichTextFieldProps,
    SelectField as RaSelectField,
    SelectFieldProps,
    TextField as RaTextField,
    TextFieldProps,
    UrlField as RaUrlField,
    UrlFieldProps,
    WrapperField as RaWrapperField,
    WrapperFieldProps,
} from 'react-admin';
import { Post } from '../types';

export const ArrayField = (props: ArrayFieldProps<Post>) => (
    <RaArrayField<Post> {...props} />
);

export const BooleanField = (props: BooleanFieldProps<Post>) => (
    <RaBooleanField<Post> {...props} />
);

export const ChipField = (props: ChipFieldProps<Post>) => (
    <RaChipField<Post> {...props} />
);

export const NumberField = (props: NumberFieldProps<Post>) => (
    <RaNumberField<Post> {...props} />
);

export const DateField = (props: DateFieldProps<Post>) => (
    <RaDateField<Post> {...props} />
);

export const EmailField = (props: EmailFieldProps<Post>) => (
    <RaEmailField<Post> {...props} />
);

export const FileField = (props: FileFieldProps<Post>) => (
    <RaFileField<Post> {...props} />
);

export const FunctionField = (props: FunctionFieldProps<Post>) => (
    <RaFunctionField<Post> {...props} />
);

export const ImageField = (props: ImageFieldProps<Post>) => (
    <RaImageField<Post> {...props} />
);

export const ReferenceArrayField = (props: ReferenceArrayFieldProps<Post>) => (
    <RaReferenceArrayField<Post> {...props} />
);

export const ReferenceField = (props: ReferenceFieldProps<Post>) => (
    <RaReferenceField<Post> {...props} />
);

export const ReferenceManyCount = (props: ReferenceManyCountProps<Post>) => (
    <RaReferenceManyCount<Post> {...props} />
);

export const ReferenceManyField = (props: ReferenceManyFieldProps<Post>) => (
    <RaReferenceManyField<Post> {...props} />
);

export const RichTextField = (props: RichTextFieldProps<Post>) => (
    <RaRichTextField<Post> {...props} />
);

export const SelectField = (props: SelectFieldProps<Post>) => (
    <RaSelectField<Post> {...props} />
);

export const TextField = (props: TextFieldProps<Post>) => (
    <RaTextField<Post> {...props} />
);

export const UrlField = (props: UrlFieldProps<Post>) => (
    <RaUrlField<Post> {...props} />
);

export const WrapperField = (props: WrapperFieldProps<Post>) => (
    <RaWrapperField<Post> {...props} />
);
