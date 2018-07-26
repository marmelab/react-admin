import React, { Fragment } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    EditButton,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceInput,
    Responsive,
    TextField,
    TextInput,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/icons/AttachMoney';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
        <TextInput source="total_gte" />
        <NullableBooleanInput source="returned" />
    </Filter>
));

class ListTabs extends React.Component {
    handleChange = (event, value) => {
        const { filterValues, setFilters } = this.props;
        setFilters({ ...filterValues, status: value });
    };

    render() {
        const { filterValues } = this.props;
        const choices = [
            { id: 'ordered', name: 'ordered' },
            { id: 'delivered', name: 'delivered' },
            { id: 'cancelled', name: 'cancelled' },
        ];
        return (
            <Fragment>
                <Tabs
                    fullWidth
                    value={filterValues.status}
                    indicatorColor="primary"
                    onChange={this.handleChange}
                >
                    {choices.map(choice => (
                        <Tab
                            key={choice.id}
                            label={choice.name}
                            value={choice.id}
                        />
                    ))}
                </Tabs>
                <Divider />
            </Fragment>
        );
    }
}

const listStyles = {
    total: { fontWeight: 'bold' },
};

const CommandList = ({ classes, ...props }) => (
    <List
        {...props}
        filters={<CommandFilter />}
        filterDefaultValues={{ status: 'ordered' }}
        header={<ListTabs />}
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
                    <BooleanField source="returned" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
);

export default withStyles(listStyles)(CommandList);
