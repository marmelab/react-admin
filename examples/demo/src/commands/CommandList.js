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
    SearchInput,
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
        <SearchInput source="q" alwaysOn />
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

const datagridStyles = {
    total: { fontWeight: 'bold' },
};

class TabbedDatagrid extends React.Component {
    tabs = [
        { id: 'ordered', name: 'ordered' },
        { id: 'delivered', name: 'delivered' },
        { id: 'cancelled', name: 'cancelled' },
    ];

    state = { ordered: [], delivered: [], cancelled: [] };

    static getDerivedStateFromProps(props, state) {
        if (props.ids !== state[props.filterValues.status]) {
            return { ...state, [props.filterValues.status]: props.ids };
        }
        return null;
    }

    handleChange = (event, value) => {
        const { filterValues, setFilters } = this.props;
        setFilters({ ...filterValues, status: value });
    };

    render() {
        const { classes, filterValues, ...props } = this.props;
        return (
            <Fragment>
                <Tabs
                    fullWidth
                    centered
                    value={filterValues.status}
                    indicatorColor="primary"
                    onChange={this.handleChange}
                >
                    {this.tabs.map(choice => (
                        <Tab
                            key={choice.id}
                            label={choice.name}
                            value={choice.id}
                        />
                    ))}
                </Tabs>
                <Divider />
                <Responsive
                    xsmall={
                        <MobileGrid
                            {...props}
                            ids={this.state[filterValues.status]}
                        />
                    }
                    medium={
                        <div>
                            {filterValues.status === 'ordered' && (
                                <Datagrid
                                    {...props}
                                    ids={this.state['ordered']}
                                >
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
                                    <EditButton />
                                </Datagrid>
                            )}
                            {filterValues.status === 'delivered' && (
                                <Datagrid
                                    {...props}
                                    ids={this.state['delivered']}
                                >
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
                            )}
                            {filterValues.status === 'cancelled' && (
                                <Datagrid
                                    {...props}
                                    ids={this.state['cancelled']}
                                >
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
                            )}
                        </div>
                    }
                />
            </Fragment>
        );
    }
}

const StyledTabbedDatagrid = withStyles(datagridStyles)(TabbedDatagrid);

const CommandList = ({ classes, ...props }) => (
    <List
        {...props}
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={<CommandFilter />}
    >
        <StyledTabbedDatagrid />
    </List>
);

export default CommandList;
