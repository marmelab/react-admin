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
            `<DataTable.Col source="${props.source}"><ArrayField source="${
                props.source
            }"><SingleFieldList><ChipField source="${
                children.length > 0 && children[0].getProps().source
            }" /></SingleFieldList></ArrayField></DataTable.Col>`,
    },
    boolean: {
        component: props => <DataTable.Col {...props} field={BooleanField} />,
        representation: props =>
            `<DataTable.Col source="${props.source}" field={BooleanField} />`,
    },
    date: {
        component: props => <DataTable.Col {...props} field={DateField} />,
        representation: props =>
            `<DataTable.Col source="${props.source}" field={DateField} />`,
    },
    email: {
        component: props => <DataTable.Col {...props} field={EmailField} />,
        representation: props =>
            `<DataTable.Col source="${props.source}" field={EmailField} />`,
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
            `<DataTable.Col source="${props.source}"><ReferenceField source="${props.source}" reference="${props.reference}" /></DataTable.Col>`,
    },
    referenceChild: {
        component: () => <DataTable.Col source="id" />,
        representation: () => `<DataTable.Col source="id" />`,
    },
    referenceArray: {
        component: props => (
            <DataTable.Col {...props}>
                <ReferenceArrayField {...props} />
            </DataTable.Col>
        ),
        representation: props =>
            `<DataTable.Col source="${props.source}"><ReferenceArrayField source="${props.source}" reference="${props.reference}" /></DataTable.Col>`,
    },
    referenceArrayChild: {
        component: () => (
            <DataTable.Col>
                <SingleFieldList>
                    <ChipField source="id" />
                </SingleFieldList>
            </DataTable.Col>
        ),
        representation: () =>
            `<DataTable.Col><SingleFieldList><ChipField source="id" /></SingleFieldList></DataTable.Col>`,
    },
    richText: undefined, // never display a rich text field in a datagrid
    string: {
        component: DataTable.Col,
        representation: props => `<DataTable.Col source="${props.source}" />`,
    },
    url: {
        component: props => <DataTable.Col {...props} field={UrlField} />,
        representation: props =>
            `<DataTable.Col source="${props.source}" field={UrlField} />`,
    },
};
