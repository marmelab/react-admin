import * as React from 'react';
import { DataTable } from './datatable';
import { SingleFieldList } from './SingleFieldList';
import {
    ArrayField,
    BooleanField,
    ChipField,
    DateField,
    EmailField,
    ReferenceField,
    ReferenceArrayField,
    UrlField,
    ArrayFieldProps,
    TextField,
    TextArrayField,
} from '../field';

export const listFieldTypes = {
    table: {
        component: props => {
            return <DataTable {...props} />;
        },
        representation: (_props, children) => `        <DataTable>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </DataTable>`,
    },
    array: {
        component: ({ children, ...props }: ArrayFieldProps) => {
            const childrenArray = React.Children.toArray(children);
            return (
                <DataTable.Col {...props}>
                    <ArrayField {...props}>
                        <SingleFieldList>
                            <ChipField
                                source={
                                    childrenArray.length > 0 &&
                                    React.isValidElement(childrenArray[0]) &&
                                    childrenArray[0].props.source
                                }
                            />
                        </SingleFieldList>
                    </ArrayField>
                </DataTable.Col>
            );
        },
        representation: (props, children) =>
            `<DataTable.Col source="${props.source}">
                <ArrayField source="${props.source}">
                    <SingleFieldList>
                        <ChipField source="${children.length > 0 && children[0].getProps().source}" />
                    </SingleFieldList>
                </ArrayField>
            </DataTable.Col>`,
    },
    scalar_array: {
        component: (props: ArrayFieldProps) => {
            return (
                <DataTable.Col {...props}>
                    <TextArrayField {...props} />
                </DataTable.Col>
            );
        },
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <TextArrayField source="${props.source}" />
            </DataTable.Col>`,
    },
    boolean: {
        component: props => (
            <DataTable.Col {...props}>
                <BooleanField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <BooleanField source="${props.source}" />
            </DataTable.Col>`,
    },
    date: {
        component: props => (
            <DataTable.Col {...props}>
                <DateField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <DateField source="${props.source}" />
            </DataTable.Col>`,
    },
    email: {
        component: props => (
            <DataTable.Col {...props}>
                <EmailField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <EmailField source="${props.source}" />
            </DataTable.Col>`,
    },
    id: {
        component: props => <DataTable.Col {...props} />,
        representation: props => `<DataTable.Col source="${props.source}" />`,
    },
    number: {
        component: DataTable.NumberCol,
        representation: props =>
            `<DataTable.NumberCol source="${props.source}" />`,
    },
    reference: {
        component: props => (
            <DataTable.Col {...props}>
                <ReferenceField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <ReferenceField source="${props.source}" reference="${props.reference}" />
            </DataTable.Col>`,
    },
    referenceChild: {
        component: () => <TextField source="id" />,
        representation: () => `<TextField source="id" />`,
    },
    referenceArray: {
        component: props => (
            <DataTable.Col {...props}>
                <ReferenceArrayField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <ReferenceArrayField source="${props.source}" reference="${props.reference}" />
            </DataTable.Col>`,
    },
    referenceArrayChild: {
        component: () => (
            <SingleFieldList>
                <ChipField source="id" />
            </SingleFieldList>
        ),
        representation: () =>
            `<SingleFieldList>
                <ChipField source="id" />
            </SingleFieldList>`,
    },
    richText: undefined, // never display a rich text field in a datagrid
    string: {
        component: DataTable.Col,
        representation: props => `<DataTable.Col source="${props.source}" />`,
    },
    url: {
        component: props => (
            <DataTable.Col {...props}>
                <UrlField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}">
                <UrlField source="${props.source}" />
            </DataTable.Col>`,
    },
};
