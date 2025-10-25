import * as React from 'react';
import { ReactNode } from 'react';
import { SimpleForm } from '../form';
import {
    ArrayInput,
    BooleanInput,
    DateInput,
    NumberInput,
    ReferenceInput,
    ReferenceInputProps,
    ReferenceArrayInput,
    ReferenceArrayInputProps,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    TextArrayInput,
} from '../input';
import { InferredElement, InferredTypeMap, InputProps } from 'ra-core';

export const editFieldTypes: InferredTypeMap = {
    form: {
        component: SimpleForm,
        representation: (
            _,
            children: InferredElement[]
        ) => `        <SimpleForm>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </SimpleForm>`,
    },
    array: {
        component: ({
            children,
            ...props
        }: { children: ReactNode } & InputProps) => (
            <ArrayInput {...props}>
                <SimpleFormIterator>{children}</SimpleFormIterator>
            </ArrayInput>
        ),
        representation: (props: InputProps, children: InferredElement[]) =>
            `<ArrayInput source="${props.source}"><SimpleFormIterator>${children
                .map(child => child.getRepresentation())
                .join('\n')}</SimpleFormIterator></ArrayInput>`,
    },
    scalar_array: {
        component: TextArrayInput,
        representation: (props: InputProps) =>
            `<TextArrayInput source="${props.source}" />`,
    },
    boolean: {
        component: BooleanInput,
        representation: (props: InputProps) =>
            `<BooleanInput source="${props.source}" />`,
    },
    date: {
        component: DateInput,
        representation: (props: InputProps) =>
            `<DateInput source="${props.source}" />`,
    },
    email: {
        component: TextInput,
        representation: (props: InputProps) =>
            `<TextInput source="${props.source}" />`,
    },
    id: {
        component: TextInput,
        representation: (props: InputProps) =>
            `<TextInput source="${props.source}" />`,
    },
    number: {
        component: NumberInput,
        representation: (props: InputProps) =>
            `<NumberInput source="${props.source}" />`,
    },
    reference: {
        component: ReferenceInput,
        representation: (props: ReferenceInputProps) =>
            `<ReferenceInput source="${props.source}" reference="${props.reference}" />`,
    },
    referenceArray: {
        component: ReferenceArrayInput,
        representation: (props: ReferenceArrayInputProps) =>
            `<ReferenceArrayInput source="${props.source}" reference="${props.reference}" />`,
    },
    referenceArrayChild: {
        component: (props: { children: ReactNode } & InputProps) => (
            <SelectInput optionText="id" {...props} />
        ),
        representation: () => `<SelectInput optionText="id" />`,
    },
    richText: {
        component: TextInput,
        representation: (props: InputProps) =>
            `<TextInput source="${props.source}" />`,
    },
    string: {
        component: TextInput,
        representation: (props: InputProps) =>
            `<TextInput source="${props.source}" />`,
    },
    url: {
        component: TextInput,
        representation: (props: InputProps) =>
            `<TextInput source="${props.source}" />`,
    },
};
