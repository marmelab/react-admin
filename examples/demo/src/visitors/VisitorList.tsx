import * as React from 'react';
import {
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    List,
    NullableBooleanInput,
    NumberField,
    SearchInput,
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';

import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import VisitorListAside from './VisitorListAside';

const visitorFilters = [
    <SearchInput source="q" alwaysOn />,
    <DateInput source="last_seen_gte" />,
    <NullableBooleanInput source="has_ordered" />,
    <NullableBooleanInput source="has_newsletter" defaultValue />,
    <SegmentInput source="groups" />,
];

const VisitorList = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    return (
        <List
            filters={isSmall ? visitorFilters : undefined}
            sort={{ field: 'last_seen', order: 'DESC' }}
            perPage={25}
            aside={<VisitorListAside />}
        >
            {isXsmall ? (
                <MobileGrid />
            ) : (
                <Datagrid
                    optimized
                    rowClick="edit"
                    sx={{
                        '& .column-groups': {
                            md: { display: 'none' },
                            lg: { display: 'table-cell' },
                        },
                    }}
                >
                    <CustomerLinkField />
                    <DateField source="last_seen" />
                    <NumberField
                        source="nb_commands"
                        label="resources.customers.fields.commands"
                        sx={{ color: 'purple' }}
                    />
                    <ColoredNumberField
                        source="total_spent"
                        options={{ style: 'currency', currency: 'USD' }}
                    />
                    <DateField source="latest_purchase" showTime />
                    <BooleanField source="has_newsletter" label="News." />
                    <SegmentsField source="groups" />
                </Datagrid>
            )}
        </List>
    );
};

export default VisitorList;
