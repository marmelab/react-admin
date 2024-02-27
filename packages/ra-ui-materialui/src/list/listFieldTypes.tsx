import * as React from 'react';
import { Datagrid } from './datagrid';
import { SingleFieldList } from './SingleFieldList';
import {
    ArrayField,
    BooleanField,
    ChipField,
    DateField,
    EmailField,
    NumberField,
    ReferenceField,
    ReferenceArrayField,
    TextField,
    UrlField,
    ArrayFieldProps,
} from '../field';

export const listFieldTypes = {
    table: {
        component: props => {
            return <Datagrid {...props} />;
        }, // eslint-disable-line react/display-name
        representation: (_props, children) => `        <Datagrid>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </Datagrid>`,
    },
    array: {
        // eslint-disable-next-line react/display-name
        component: ({ children, ...props }: ArrayFieldProps) => {
            const childrenArray = React.Children.toArray(children);
            return (
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
            );
        },
        representation: (props, children) =>
            `<ArrayField source="${
                props.source
            }"><SingleFieldList><ChipField source="${
                children.length > 0 && children[0].getProps().source
            }" /></SingleFieldList></ArrayField>`,
    },
    boolean: {
        component: BooleanField,
        representation: props => `<BooleanField source="${props.source}" />`,
    },
    date: {
        component: DateField,
        representation: props => `<DateField source="${props.source}" />`,
    },
    email: {
        component: EmailField,
        representation: props => `<EmailField source="${props.source}" />`,
    },
    id: {
        component: TextField,
        representation: props => `<TextField source="${props.source}" />`,
    },
    number: {
        component: NumberField,
        representation: props => `<NumberField source="${props.source}" />`,
    },
    reference: {
        component: ReferenceField,
        representation: props =>
            `<ReferenceField source="${props.source}" reference="${props.reference}" />`,
    },
    referenceChild: {
        component: () => <TextField source="id" />, // eslint-disable-line react/display-name
        representation: () => `<TextField source="id" />`,
    },
    referenceArray: {
        component: ReferenceArrayField,
        representation: props =>
            `<ReferenceArrayField source="${props.source}" reference="${props.reference}" />`,
    },
    referenceArrayChild: {
        component: () => (
            <SingleFieldList>
                <ChipField source="id" />
            </SingleFieldList>
        ), // eslint-disable-line react/display-name
        representation: () =>
            `<SingleFieldList><ChipField source="id" /></SingleFieldList>`,
    },
    richText: undefined, // never display a rich text field in a datagrid
    string: {
        component: TextField,
        representation: props => `<TextField source="${props.source}" />`,
    },
    url: {
        component: UrlField,
        representation: props => `<UrlField source="${props.source}" />`,
    },
};
