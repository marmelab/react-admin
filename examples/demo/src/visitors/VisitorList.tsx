import * as React from 'react';
import {
    BooleanField,
    CreateButton,
    DataTable,
    DateField,
    DateInput,
    ExportButton,
    List,
    NullableBooleanInput,
    SearchInput,
    ColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
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

const VisitorListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const VisitorTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
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
                <DataTable
                    rowClick="edit"
                    sx={{
                        '& .column-groups': {
                            md: { display: 'none' },
                            lg: { display: 'table-cell' },
                        },
                    }}
                    hiddenColumns={['birthday']}
                >
                    <DataTable.Col
                        source="last_name"
                        label="resources.customers.fields.full_name"
                    >
                        <CustomerLinkField />
                    </DataTable.Col>
                    <DataTable.Col source="last_seen" field={DateField} />
                    <DataTable.NumberCol
                        source="nb_orders"
                        label="resources.customers.fields.orders"
                    />
                    <DataTable.Col source="total_spent" align="right">
                        <ColoredNumberField
                            source="total_spent"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                    </DataTable.Col>
                    <DataTable.Col source="latest_purchase">
                        <DateField source="latest_purchase" showTime />
                    </DataTable.Col>
                    <DataTable.Col source="has_newsletter">
                        <BooleanField source="has_newsletter" label="News." />
                    </DataTable.Col>
                    <DataTable.Col source="groups">
                        <SegmentsField source="groups" />
                    </DataTable.Col>
                    <DataTable.Col source="birthday" field={DateField} />
                </DataTable>
            )}
        </List>
    );
};

export default VisitorList;
