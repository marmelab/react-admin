import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import MailIcon from '@mui/icons-material/MailOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import {
    FilterList,
    FilterListItem,
    FilterLiveSearch,
    SavedQueriesList,
} from 'react-admin';
import {
    endOfYesterday,
    startOfWeek,
    subWeeks,
    startOfMonth,
    subMonths,
} from 'date-fns';

import segments from '../segments/data';

const Aside = () => (
    <Card
        sx={{
            display: {
                xs: 'none',
                md: 'block',
            },
            order: -1,
            flex: '0 0 15em',
            mr: 2,
            mt: 6,
            alignSelf: 'flex-start',
        }}
    >
        <CardContent sx={{ pt: 1 }}>
            <FilterLiveSearch hiddenLabel />

            <SavedQueriesList />

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
                        nb_orders_gte: 1,
                        nb_orders_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{
                        nb_orders_gte: undefined,
                        nb_orders_lte: 0,
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
    </Card>
);

export default Aside;
