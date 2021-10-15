import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import MailIcon from '@mui/icons-material/MailOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import { FilterList, FilterListItem, FilterLiveSearch } from 'react-admin';
import {
    endOfYesterday,
    startOfWeek,
    subWeeks,
    startOfMonth,
    subMonths,
} from 'date-fns';

import segments from '../segments/data';

const PREFIX = 'Aside';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledCard = styled(Card)(({ theme }) => ({
    [`&.${classes.root}`]: {
        [theme.breakpoints.up('md')]: {
            order: -1,
            width: '15em',
            marginRight: '1em',
        },
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
}));

const Aside = () => (
    <StyledCard className={classes.root}>
        <CardContent>
            <FilterLiveSearch />

            <FilterList
                label="resources.customers.filters.last_visited"
                icon={<AccessTimeIcon />}
            >
                <FilterListItem
                    label="resources.customers.filters.today"
                    value={{
                        last_seen_gte: endOfYesterday().toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.customers.filters.this_week"
                    value={{
                        last_seen_gte: startOfWeek(new Date()).toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.customers.filters.last_week"
                    value={{
                        last_seen_gte: subWeeks(
                            startOfWeek(new Date()),
                            1
                        ).toISOString(),
                        last_seen_lte: startOfWeek(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="resources.customers.filters.this_month"
                    value={{
                        last_seen_gte: startOfMonth(new Date()).toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.customers.filters.last_month"
                    value={{
                        last_seen_gte: subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                        last_seen_lte: startOfMonth(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="resources.customers.filters.earlier"
                    value={{
                        last_seen_gte: undefined,
                        last_seen_lte: subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                    }}
                />
            </FilterList>

            <FilterList
                label="resources.customers.filters.has_ordered"
                icon={<MonetizationOnIcon />}
            >
                <FilterListItem
                    label="ra.boolean.true"
                    value={{
                        nb_commands_gte: 1,
                        nb_commands_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{
                        nb_commands_gte: undefined,
                        nb_commands_lte: 0,
                    }}
                />
            </FilterList>

            <FilterList
                label="resources.customers.filters.has_newsletter"
                icon={<MailIcon />}
            >
                <FilterListItem
                    label="ra.boolean.true"
                    value={{ has_newsletter: true }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{ has_newsletter: false }}
                />
            </FilterList>

            <FilterList
                label="resources.customers.filters.group"
                icon={<LocalOfferIcon />}
            >
                {segments.map(segment => (
                    <FilterListItem
                        label={segment.name}
                        key={segment.id}
                        value={{ groups: segment.id }}
                    />
                ))}
            </FilterList>
        </CardContent>
    </StyledCard>
);

export default Aside;
