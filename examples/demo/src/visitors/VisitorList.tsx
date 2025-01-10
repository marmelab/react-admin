import * as React from 'react';
import {
    BooleanField,
    CreateButton,
    DatagridConfigurable,
    DateField,
    DateInput,
    ExportButton,
    List,
    NullableBooleanInput,
    NumberField,
    SearchInput,
    SelectColumnsButton,
    TopToolbar,
    useDefaultTitle,
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';

import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import VisitorListAside from './VisitorListAside';
import { usePageTitle } from '../usePageTitle';

const visitorFilters = [
    <SearchInput source="q" alwaysOn />,
    <DateInput source="last_seen_gte" />,
    <NullableBooleanInput source="has_ordered" />,
    <NullableBooleanInput source="has_newsletter" defaultValue />,
    <SegmentInput source="groups" />,
];

const VisitorListActions = () => (
    <TopToolbar>
        <CreateButton />
        <SelectColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const VisitorTitle = () => {
    const title = useDefaultTitle();
    const pageTitle = usePageTitle({ view: 'list' });
    return (
        <>
            <title>{`${title} - ${pageTitle}`}</title>
            <span>{pageTitle}</span>
        </>
    );
};

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
            actions={<VisitorListActions />}
            title={<VisitorTitle />}
        >
            {isXsmall ? (
                <MobileGrid />
            ) : (
                <DatagridConfigurable
                    rowClick="edit"
                    sx={{
                        '& .column-groups': {
                            md: { display: 'none' },
                            lg: { display: 'table-cell' },
                        },
                    }}
                    omit={['birthday']}
                >
                    <CustomerLinkField
                        source="last_name"
                        label="resources.customers.fields.full_name"
                    />
                    <DateField source="last_seen" />
                    <NumberField
                        source="nb_orders"
                        label="resources.customers.fields.orders"
                    />
                    <ColoredNumberField
                        source="total_spent"
                        options={{ style: 'currency', currency: 'USD' }}
                        textAlign="right"
                    />
                    <DateField source="latest_purchase" showTime />
                    <BooleanField source="has_newsletter" label="News." />
                    <SegmentsField source="groups" />
                    <DateField source="birthday" />
                </DatagridConfigurable>
            )}
        </List>
    );
};

export default VisitorList;
