import React from 'react';
import {
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    EditButton,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    Responsive,
    SearchInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';

const VisitorFilter = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <DateInput source="last_seen_gte" />
        <NullableBooleanInput source="has_ordered" />
        <NullableBooleanInput source="has_newsletter" defaultValue />
        <SegmentInput />
    </Filter>
);

const useStyles = makeStyles({
    nb_commands: { color: 'purple' },
});

const VisitorList = props => {
    const classes = useStyles();
    return (
        <List
            {...props}
            filters={<VisitorFilter />}
            sort={{ field: 'last_seen', order: 'DESC' }}
            perPage={25}
        >
            <Responsive
                xsmall={<MobileGrid />}
                medium={
                    <Datagrid>
                        <CustomerLinkField />
                        <DateField source="last_seen" type="date" />
                        <NumberField
                            source="nb_commands"
                            label="resources.customers.fields.commands"
                            className={classes.nb_commands}
                        />
                        <ColoredNumberField
                            source="total_spent"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                        <DateField source="latest_purchase" showTime />
                        <BooleanField source="has_newsletter" label="News." />
                        <SegmentsField />
                        <EditButton />
                    </Datagrid>
                }
            />
        </List>
    );
};

export default VisitorList;
