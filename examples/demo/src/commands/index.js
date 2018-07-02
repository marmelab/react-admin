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
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/icons/AttachMoney';

import Basket from './Basket';
import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import MobileGrid from './MobileGrid';

export const CommandIcon = Icon;

const filterStyles = {
    status: { width: 150 },
};

const CommandFilter = withStyles(filterStyles)(({ classes, ...props }) => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <ReferenceInput source="customer_id" reference="customers">
            <AutocompleteInput
                optionText={choice =>
                    `${choice.first_name} ${choice.last_name}`
                }
            />
        </ReferenceInput>
        <SelectInput
            source="status"
            choices={[
                { id: 'delivered', name: 'delivered' },
                { id: 'ordered', name: 'ordered' },
                { id: 'cancelled', name: 'cancelled' },
            ]}
            className={classes.status}
        />
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
        <TextInput source="total_gte" />
        <NullableBooleanInput source="returned" />
    </Filter>
));

const listStyles = {
    total: { fontWeight: 'bold' },
};

export const CommandList = withStyles(listStyles)(({ classes, ...props }) => (
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
        {translate('resources.commands.name', { smart_count: 1 })} #{
            record.reference
        }
    </span>
));

const editStyles = {
    clear: { clear: 'both' },
};

export const CommandEdit = withStyles(editStyles)(({ classes, ...props }) => (
    <Edit title={<CommandTitle />} {...props}>
        <SimpleForm>
            <Basket />
            <DateInput source="date" />
            <ReferenceInput source="customer_id" reference="customers">
                <AutocompleteInput
                    optionText={choice =>
                        `${choice.first_name} ${choice.last_name}`
                    }
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
