import * as React from 'react';
import { useMemo } from 'react';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@material-ui/core';
import CustomerIcon from '@material-ui/icons/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useQueryWithStore } from 'react-admin';

import CardWithIcon from './CardWithIcon';
import { Customer } from '../types';

const NewCustomers = () => {
    const translate = useTranslate();
    const aMonthAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }, []);

    const { loaded, data: visitors } = useQueryWithStore({
        type: 'getList',
        resource: 'customers',
        payload: {
            filter: {
                has_ordered: true,
                first_seen_gte: aMonthAgo.toISOString(),
            },
            sort: { field: 'first_seen', order: 'DESC' },
            pagination: { page: 1, perPage: 100 },
        },
    });

    if (!loaded) return null;

    const nb = visitors ? visitors.reduce((nb: number) => ++nb, 0) : 0;
    return (
        <CardWithIcon
            to="/customers"
            icon={CustomerIcon}
            title={translate('pos.dashboard.new_customers')}
            subtitle={nb}
        >
            <List>
                {visitors
                    ? visitors.map((record: Customer) => (
                          <ListItem
                              button
                              to={`/customers/${record.id}`}
                              component={Link}
                              key={record.id}
                          >
                              <ListItemAvatar>
                                  <Avatar src={`${record.avatar}?size=32x32`} />
                              </ListItemAvatar>
                              <ListItemText
                                  primary={`${record.first_name} ${record.last_name}`}
                              />
                          </ListItem>
                      ))
                    : null}
            </List>
            <Box flexGrow="1">&nbsp;</Box>
            <Box p={1} display="flex" justifyContent="center">
                <Link to="/customers">
                    <Button size="small" color="primary">
                        {translate('pos.dashboard.all_customers')}
                    </Button>
                </Link>
            </Box>
        </CardWithIcon>
    );
};

export default NewCustomers;
