import React, { Fragment } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    EditButton,
    Filter,
    Header,
    ListActions,
    ListController,
    NullableBooleanInput,
    NumberField,
    Pagination,
    ReferenceInput,
    Responsive,
    TextField,
    TextInput,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/icons/AttachMoney';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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

const CommandList = ({ classes, ...mainProps }) => (
    <ListController
        {...mainProps}
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
    >
        {props => (
            <Card>
                <Header
                    title="Orders"
                    actions={
                        <ListActions {...props} filters={<CommandFilter />} />
                    }
                />
                <CommandFilter context="form" {...props} />
                <ListTabs
                    filterValues={props.filterValues}
                    setFilters={props.setFilters}
                />
                {(props.isLoading || props.total > 0) && (
                    <div key={props.version}>
                        <Responsive
                            xsmall={<MobileGrid {...props} />}
                            medium={
                                <Datagrid {...props}>
                                    <DateField source="date" showTime />
                                    <TextField source="reference" />
                                    <CustomerReferenceField />
                                    <NbItemsField />
                                    <NumberField
                                        source="total"
                                        options={{
                                            style: 'currency',
                                            currency: 'USD',
                                        }}
                                        className={classes.total}
                                    />
                                    <BooleanField source="returned" />
                                    <EditButton />
                                </Datagrid>
                            }
                        />
                        <Pagination {...props} />
                    </div>
                )}
            </Card>
        )}
    </ListController>
);

export default withStyles(listStyles)(CommandList);
