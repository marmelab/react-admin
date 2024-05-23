import * as React from 'react';
import { ReactNode } from 'react';
import { Datagrid } from '../list/datagrid/Datagrid';
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
} from '../field';
import { SimpleShowLayout, SimpleShowLayoutProps } from './SimpleShowLayout';
import { InferredElement, InferredTypeMap, InputProps } from 'ra-core';

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
        component: ({
            children,
            ...props
        }: { children: ReactNode } & InputProps) => (
            <ArrayField {...props}>
                <Datagrid>{children}</Datagrid>
            </ArrayField>
        ),
        representation: (props: InputProps, children: InferredElement[]) =>
            `<ArrayField source="${props.source}"><Datagrid>${children
                .map(child => child.getRepresentation())
                .join('\n')}</Datagrid></ArrayField>`,
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
            `<ReferenceArrayField source="${props.source}" reference="${props.reference}"><TextField source="id" /></ReferenceArrayField>`,
    },
    referenceArrayChild: {
        component: (
            props: { children: ReactNode } & Omit<InputProps, 'source'> &
                Partial<Pick<InputProps, 'source'>>
        ) => <TextField source="id" {...props} />, // eslint-disable-line react/display-name
        representation: () => `<TextField source="id" />`,
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
