import * as React from 'react';
import { FC } from 'react';
import {
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    Filter,
    FilterProps,
    List,
    ListProps,
    NullableBooleanInput,
    NumberField,
    SearchInput,
} from 'react-admin';
import { useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import CustomerLinkField from './CustomerLinkField';
import ColoredNumberField from './ColoredNumberField';
import MobileGrid from './MobileGrid';
import VisitorListAside from './VisitorListAside';

const VisitorFilter = (props: Omit<FilterProps, 'children'>) => (
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

const VisitorList: FC<ListProps> = (props: any) => {
    const classes = useStyles();
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    return (
        <List
            {...props}
            filters={isSmall ? <VisitorFilter /> : null}
            sort={{ field: 'last_seen', order: 'DESC' }}
            perPage={25}
            aside={<VisitorListAside />}
        >
            {isXsmall ? (
                <MobileGrid />
            ) : (
                <Datagrid optimized rowClick="edit">
                    <CustomerLinkField />
                    <DateField source="last_seen" />
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
                </Datagrid>
            )}
        </List>
    );
};

export default VisitorList;
