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
import { Comment } from '../types';

export const ArrayField = (props: ArrayFieldProps<Comment>) => (
    <RaArrayField<Comment> {...props} />
);

export const BooleanField = (props: BooleanFieldProps<Comment>) => (
    <RaBooleanField<Comment> {...props} />
);

export const ChipField = (props: ChipFieldProps<Comment>) => (
    <RaChipField<Comment> {...props} />
);

export const NumberField = (props: NumberFieldProps<Comment>) => (
    <RaNumberField<Comment> {...props} />
);

export const DateField = (props: DateFieldProps<Comment>) => (
    <RaDateField<Comment> {...props} />
);

export const EmailField = (props: EmailFieldProps<Comment>) => (
    <RaEmailField<Comment> {...props} />
);

export const FileField = (props: FileFieldProps<Comment>) => (
    <RaFileField<Comment> {...props} />
);

export const FunctionField = (props: FunctionFieldProps<Comment>) => (
    <RaFunctionField<Comment> {...props} />
);

export const ImageField = (props: ImageFieldProps<Comment>) => (
    <RaImageField<Comment> {...props} />
);

export const ReferenceArrayField = (
    props: ReferenceArrayFieldProps<Comment>
) => <RaReferenceArrayField<Comment> {...props} />;

export const ReferenceField = (props: ReferenceFieldProps<Comment>) => (
    <RaReferenceField<Comment> {...props} />
);

export const ReferenceManyCount = (props: ReferenceManyCountProps<Comment>) => (
    <RaReferenceManyCount<Comment> {...props} />
);

export const ReferenceManyField = (props: ReferenceManyFieldProps<Comment>) => (
    <RaReferenceManyField<Comment> {...props} />
);

export const RichTextField = (props: RichTextFieldProps<Comment>) => (
    <RaRichTextField<Comment> {...props} />
);

export const SelectField = (props: SelectFieldProps<Comment>) => (
    <RaSelectField<Comment> {...props} />
);

export const TextField = (props: TextFieldProps<Comment>) => (
    <RaTextField<Comment> {...props} />
);

export const UrlField = (props: UrlFieldProps<Comment>) => (
    <RaUrlField<Comment> {...props} />
);

export const WrapperField = (props: WrapperFieldProps<Comment>) => (
    <RaWrapperField<Comment> {...props} />
);
