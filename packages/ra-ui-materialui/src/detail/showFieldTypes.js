import React from 'react';
import Datagrid from '../list/Datagrid';
import ArrayField from '../field/ArrayField';
import BooleanField from '../field/BooleanField';
import DateField from '../field/DateField';
import EmailField from '../field/EmailField';
import NumberField from '../field/NumberField';
import ReferenceField from '../field/ReferenceField';
import ReferenceArrayField from '../field/ReferenceArrayField';
import RichTextField from '../field/RichTextField';
import SimpleShowLayout from './SimpleShowLayout';
import TextField from '../field/TextField';
import UrlField from '../field/UrlField';

export default {
    show: {
        component: props => <SimpleShowLayout {...props} />, // eslint-disable-line react/display-name
        representation: (_, children) => `        <SimpleShowLayout>
${children.map(child => `            ${child.getRepresentation()}`).join('\n')}
        </SimpleShowLayout>`,
    },
    array: {
        // eslint-disable-next-line react/display-name
        component: ({ children, ...props }) => (
            <ArrayField {...props}>
                <Datagrid>{children}</Datagrid>
            </ArrayField>
        ),
        representation: (props, children) =>
            `<ArrayField source="${props.source}"><Datagrid>${children
                .map(child => child.getRepresentation())
                .join('\n')}</Datagrid></ArrayField>`,
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
            `<ReferenceField source="${props.source}" reference="${
                props.reference
            }"><TextField source="id" /></ReferenceField>`,
    },
    referenceChild: {
        component: props => <TextField source="id" {...props} />, // eslint-disable-line react/display-name
        representation: () => `<TextField source="id" />`,
    },
    referenceArray: {
        component: ReferenceArrayField,
        representation: props =>
            `<ReferenceArrayField source="${props.source}" reference="${
                props.reference
            }"><TextField source="id" /></ReferenceArrayField>`,
    },
    referenceArrayChild: {
        component: props => <TextField source="id" {...props} />, // eslint-disable-line react/display-name
        representation: () => `<TextField source="id" />`,
    },
    richText: {
        component: RichTextField,
        representation: props => `<RichTextField source="${props.source}" />`,
    },
    string: {
        component: TextField,
        representation: props => `<TextField source="${props.source}" />`,
    },
    url: {
        component: UrlField,
        representation: props => `<UrlField source="${props.source}" />`,
    },
};
