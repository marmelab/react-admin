import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import CustomerIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useGetList } from 'react-admin';
import { subDays } from 'date-fns';

import CardWithIcon from './CardWithIcon';
import { Customer } from '../types';

const PREFIX = 'NewCustomers';

const classes = {
    link: `${PREFIX}-link`,
    linkContent: `${PREFIX}-linkContent`,
};

const StyledCardWithIcon = styled(CardWithIcon)(({ theme }) => ({
    [`& .${classes.link}`]: {
        borderRadius: 0,
    },

    [`& .${classes.linkContent}`]: {
        color: theme.palette.primary.main,
    },
}));

const NewCustomers = () => {
    const translate = useTranslate();

    const aMonthAgo = subDays(new Date(), 30);
    aMonthAgo.setDate(aMonthAgo.getDate() - 30);
    aMonthAgo.setHours(0);
    aMonthAgo.setMinutes(0);
    aMonthAgo.setSeconds(0);
    aMonthAgo.setMilliseconds(0);

    const { isLoading, data: visitors } = useGetList<Customer>('customers', {
        filter: {
            has_ordered: true,
            first_seen_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'first_seen', order: 'DESC' },
        pagination: { page: 1, perPage: 100 },
    });

    if (isLoading) return null;

    const nb = visitors ? visitors.reduce((nb: number) => ++nb, 0) : 0;
    return (
        <StyledCardWithIcon
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
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                className={classes.link}
                component={Link}
                to="/customers"
                size="small"
                color="primary"
            >
                <Box p={1} className={classes.linkContent}>
                    {translate('pos.dashboard.all_customers')}
                </Box>
            </Button>
        </StyledCardWithIcon>
    );
};

export default NewCustomers;
