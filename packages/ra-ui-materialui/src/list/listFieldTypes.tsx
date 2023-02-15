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
} from '../field';

export const listFieldTypes = {
    table: {
        component: props => {
            const { hasEdit, hasShow, ...rest } = props;
            return (
                <Datagrid
                    rowClick={!hasEdit && hasShow ? 'show' : 'edit'}
                    {...rest}
                />
            );
        }, // eslint-disable-line react/display-name
        representation: (props, children) => `        <Datagrid rowClick="${
            !props.hasEdit && props.hasShow ? 'show' : 'edit'
        }">
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </Datagrid>`,
    },
    array: {
        // eslint-disable-next-line react/display-name
        component: ({ children, ...props }) => (
            <ArrayField {...props}>
                <SingleFieldList>
                    <ChipField
                        source={children.length > 0 && children[0].props.source}
                    />
                </SingleFieldList>
            </ArrayField>
        ),
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
