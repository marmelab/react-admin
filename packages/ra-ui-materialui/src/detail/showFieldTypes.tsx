import * as React from 'react';
import { ReactNode } from 'react';
import {
    type InferredElement,
    type InferredTypeMap,
    type InputProps,
} from 'ra-core';
import {
    ArrayField,
    BooleanField,
    DateField,
    EmailField,
    NumberField,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceArrayField,
    ReferenceArrayFieldProps,
    RichTextField,
    TextField,
    UrlField,
    ChipField,
    TextArrayField,
} from '../field';
import { SimpleShowLayout, SimpleShowLayoutProps } from './SimpleShowLayout';
import { DataTable, SingleFieldList } from '../list';

export const showFieldTypes: InferredTypeMap = {
    show: {
        component: (props: SimpleShowLayoutProps) => (
            <SimpleShowLayout {...props} />
        ),
        representation: (_, children) => `        <SimpleShowLayout>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </SimpleShowLayout>`,
    },
    array: {
        component: ({ children, ...props }: { children } & InputProps) => (
            <ArrayField {...props}>
                <DataTable>
                    {children && children.length > 0
                        ? children.map((child, index) => (
                              <DataTable.Col key={index} {...child.props}>
                                  {child}
                              </DataTable.Col>
                          ))
                        : children}
                </DataTable>
            </ArrayField>
        ),
        representation: (props: InputProps, children: InferredElement[]) =>
            `<ArrayField source="${props.source}">
                <DataTable>
                    ${children
                        .map(
                            child => `<DataTable.Col source="${child.getProps().source}">
                        ${child.getRepresentation()}
                    </DataTable.Col>`
                        )
                        .join('\n                    ')}
                </DataTable>
            </ArrayField>`,
    },
    scalar_array: {
        component: TextArrayField,
        representation: (props: InputProps) =>
            `<TextArrayField source="${props.source}" />`,
    },
    boolean: {
        component: BooleanField,
        representation: (props: InputProps) =>
            `<BooleanField source="${props.source}" />`,
    },
    date: {
        component: DateField,
        representation: (props: InputProps) =>
            `<DateField source="${props.source}" />`,
    },
    email: {
        component: EmailField,
        representation: (props: InputProps) =>
            `<EmailField source="${props.source}" />`,
    },
    id: {
        component: TextField,
        representation: (props: InputProps) =>
            `<TextField source="${props.source}" />`,
    },
    number: {
        component: NumberField,
        representation: (props: InputProps) =>
            `<NumberField source="${props.source}" />`,
    },
    reference: {
        component: ReferenceField,
        representation: (props: ReferenceFieldProps) =>
            `<ReferenceField source="${props.source}" reference="${props.reference}" />`,
    },
    referenceChild: {
        component: (
            props: { children: ReactNode } & Omit<InputProps, 'source'> &
                Partial<Pick<InputProps, 'source'>>
        ) => <TextField source="id" {...props} />,
        representation: () => `<TextField source="id" />`,
    },
    referenceArray: {
        component: ReferenceArrayField,
        representation: (props: ReferenceArrayFieldProps) =>
            `<ReferenceArrayField source="${props.source}" reference="${props.reference}" />`,
    },
    referenceArrayChild: {
        component: () => (
            <SingleFieldList>
                <ChipField source="id" />
            </SingleFieldList>
        ),
        representation: () =>
            `<SingleFieldList><ChipField source="id" /></SingleFieldList>`,
    },
    richText: {
        component: RichTextField,
        representation: (props: InputProps) =>
            `<RichTextField source="${props.source}" />`,
    },
    string: {
        component: TextField,
        representation: (props: InputProps) =>
            `<TextField source="${props.source}" />`,
    },
    url: {
        component: UrlField,
        representation: (props: InputProps) =>
            `<UrlField source="${props.source}" />`,
    },
};
