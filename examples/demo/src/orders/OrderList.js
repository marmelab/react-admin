import React, { Fragment } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceInput,
    SearchInput,
    TextField,
    TextInput,
} from 'react-admin';
import {
    makeStyles,
    useMediaQuery,
    Divider,
    Tabs,
    Tab,
} from '@material-ui/core';

import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import MobileGrid from './MobileGrid';

const OrderFilter = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <ReferenceInput source="customer_id" reference="customers">
            <AutocompleteInput
                optionText={choice =>
                    choice.first_name && choice.last_name
                        ? `${choice.first_name} ${choice.last_name}`
                        : ''
                }
            />
        </ReferenceInput>
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
        <TextInput source="total_gte" />
        <NullableBooleanInput source="returned" />
    </Filter>
);

const useDatagridStyles = makeStyles({
    total: { fontWeight: 'bold' },
});

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
        const { isXSmall, classes, filterValues, ...props } = this.props;

        return (
            <Fragment>
                <Tabs
                    variant="fullWidth"
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
                {isXSmall ? (
                    <MobileGrid
                        {...props}
                        ids={this.state[filterValues.status]}
                    />
                ) : (
                    <div>
                        {filterValues.status === 'ordered' && (
                            <Datagrid
                                {...props}
                                ids={this.state.ordered}
                                optimized
                                rowClick="edit"
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
                            </Datagrid>
                        )}
                        {filterValues.status === 'delivered' && (
                            <Datagrid
                                {...props}
                                ids={this.state.delivered}
                                rowClick="edit"
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
                            </Datagrid>
                        )}
                        {filterValues.status === 'cancelled' && (
                            <Datagrid
                                {...props}
                                ids={this.state.cancelled}
                                rowClick="edit"
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
                            </Datagrid>
                        )}
                    </div>
                )}
            </Fragment>
        );
    }
}

const StyledTabbedDatagrid = props => {
    const classes = useDatagridStyles();
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    return <TabbedDatagrid classes={classes} isXSmall={isXSmall} {...props} />;
};

const OrderList = ({ classes, ...props }) => (
    <List
        {...props}
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={<OrderFilter />}
    >
        <StyledTabbedDatagrid />
    </List>
);

export default OrderList;
