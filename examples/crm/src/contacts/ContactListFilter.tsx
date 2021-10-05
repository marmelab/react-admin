/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    FilterList,
    FilterLiveSearch,
    FilterListItem,
    useGetIdentity,
    useGetList,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { endOfYesterday, startOfWeek, startOfMonth, subMonths } from 'date-fns';

import { Status } from '../misc/Status';

export const ContactListFilter = () => {
    const { identity } = useGetIdentity();
    const { data, ids } = useGetList(
        'tags',
        { page: 1, perPage: 10 },
        { field: 'name', order: 'ASC' }
    );
    return (
        <Box width="15em" order="-1" marginRight="1em">
            <FilterLiveSearch />
            <FilterList label="Last seen" icon={<AccessTimeIcon />}>
                <FilterListItem
                    label="Today"
                    value={{
                        last_seen_gte: endOfYesterday().toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="This week"
                    value={{
                        last_seen_gte: startOfWeek(new Date()).toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="Before this week"
                    value={{
                        last_seen_gte: undefined,
                        last_seen_lte: startOfWeek(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="Before this month"
                    value={{
                        last_seen_gte: undefined,
                        last_seen_lte: startOfMonth(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="Before last month"
                    value={{
                        last_seen_gte: undefined,
                        last_seen_lte: subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                    }}
                />
            </FilterList>
            <FilterList label="Status" icon={<TrendingUpIcon />}>
                <FilterListItem
                    label={
                        <>
                            Cold <Status status="cold" />
                        </>
                    }
                    value={{
                        status: 'cold',
                    }}
                />
                <FilterListItem
                    label={
                        <>
                            Warm <Status status="warm" />
                        </>
                    }
                    value={{
                        status: 'warm',
                    }}
                />
                <FilterListItem
                    label={
                        <>
                            Hot <Status status="hot" />
                        </>
                    }
                    value={{
                        status: 'hot',
                    }}
                />
                <FilterListItem
                    label={
                        <>
                            In contract <Status status="in-contract" />
                        </>
                    }
                    value={{
                        status: 'in-contract',
                    }}
                />
            </FilterList>
            <FilterList label="Tags" icon={<LocalOfferIcon />}>
                {ids &&
                    data &&
                    ids.map(id => (
                        <FilterListItem
                            key={id}
                            label={
                                <Chip
                                    label={data[id]?.name}
                                    size="small"
                                    style={{
                                        backgroundColor: data[id]?.color,
                                        border: 0,
                                        cursor: 'pointer',
                                    }}
                                />
                            }
                            value={{ tags: [id] }}
                        />
                    ))}
            </FilterList>
            <FilterList
                label="Account manager"
                icon={<SupervisorAccountIcon />}
            >
                <FilterListItem
                    label="Me"
                    value={{
                        sales_id: identity && identity.id,
                    }}
                />
            </FilterList>
        </Box>
    );
};
