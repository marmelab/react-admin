import React from 'react';
import {
    translate,
    AutocompleteInput,
    BooleanField,
    BooleanInput,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceInput,
    Responsive,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import Icon from 'material-ui-icons/AttachMoney';
import { withStyles } from 'material-ui/styles';

import Basket from './Basket';
import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import MobileGrid from './MobileGrid';

export const CommandIcon = Icon;

const CommandFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <ReferenceInput source="customer.id" reference="Customer">
            <AutocompleteInput
                optionText={choice => `${choice.firstName} ${choice.lastName}`}
            />
        </ReferenceInput>
        <SelectInput
            source="status"
            choices={[
                { id: 'delivered', name: 'delivered' },
                { id: 'ordered', name: 'ordered' },
                { id: 'cancelled', name: 'cancelled' },
            ]}
            elStyle={{ width: 150 }}
        />
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
        <TextInput source="total_gte" />
        <NullableBooleanInput source="returned" />
    </Filter>
);

const styles = {
    total: {
        fontWeight: 'bold',
    },
};

export const CommandList = withStyles(styles)(({ classes, ...props }) => (
    <List
        {...props}
        filters={<CommandFilter />}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
    >
        <Responsive
            xsmall={<MobileGrid />}
            medium={
                <Datagrid>
                    <DateField source="date" showTime />
                    <TextField source="reference" />
                    <CustomerReferenceField />
                    <NbItemsField />
                    <NumberField
                        source="total"
                        options={{ style: 'currency', currency: 'USD' }}
                        className={classes.total}
                    />
                    <TextField source="status" />
                    <BooleanField source="returned" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
));

const CommandTitle = translate(({ record, translate }) => (
    <span>
        {translate('resources.Command.name', { smart_count: 1 })} #{record.reference}
    </span>
));

export const CommandEdit = translate(({ translate, ...rest }) => (
    <Edit title={<CommandTitle />} {...rest}>
        <SimpleForm>
            <Basket />
            <DateInput source="date" />
            <ReferenceInput source="customer.id" reference="Customer">
                <AutocompleteInput
                    optionText={choice =>
                        `${choice.firstName} ${choice.lastName}`}
                />
            </ReferenceInput>
            <SelectInput
                source="status"
                choices={[
                    { id: 'delivered', name: 'delivered' },
                    { id: 'ordered', name: 'ordered' },
                    { id: 'cancelled', name: 'cancelled' },
                ]}
            />
            <BooleanInput source="returned" />
        </SimpleForm>
    </Edit>
));
