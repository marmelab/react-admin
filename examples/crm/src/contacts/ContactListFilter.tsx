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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { endOfYesterday, startOfWeek, startOfMonth, subMonths } from 'date-fns';

import { Status } from '../misc/Status';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const ContactListFilter = () => {
    const { noteStatuses } = useConfigurationContext();
    const { identity } = useGetIdentity();
    const { data } = useGetList('tags', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });
    return (
        <Box width="13em" minWidth="13em" order={-1} mr={2} mt={5}>
            <FilterLiveSearch
                hiddenLabel
                sx={{
                    display: 'block',
                    '& .MuiFilledInput-root': { width: '100%' },
                }}
                placeholder="Search name, company, etc."
            />
            <FilterList label="Last activity" icon={<AccessTimeIcon />}>
                <FilterListItem
                    label="Today"
                    value={{
                        'last_seen@gte': endOfYesterday().toISOString(),
                        'last_seen@lte': undefined,
                    }}
                />
                <FilterListItem
                    label="This week"
                    value={{
                        'last_seen@gte': startOfWeek(new Date()).toISOString(),
                        'last_seen@lte': undefined,
                    }}
                />
                <FilterListItem
                    label="Before this week"
                    value={{
                        'last_seen@gte': undefined,
                        'last_seen@lte': startOfWeek(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="Before this month"
                    value={{
                        'last_seen@gte': undefined,
                        'last_seen@lte': startOfMonth(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="Before last month"
                    value={{
                        'last_seen@gte': undefined,
                        'last_seen@lte': subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                    }}
                />
            </FilterList>
            <FilterList label="Status" icon={<TrendingUpIcon />}>
                {noteStatuses.map(status => (
                    <FilterListItem
                        key={status.value}
                        label={
                            <>
                                {status.label} <Status status={status.value} />
                            </>
                        }
                        value={{ status: status.value }}
                    />
                ))}
            </FilterList>
            <FilterList label="Tags" icon={<LocalOfferIcon />}>
                {data &&
                    data.map(record => (
                        <FilterListItem
                            key={record.id}
                            label={
                                <Chip
                                    label={record?.name}
                                    size="small"
                                    style={{
                                        backgroundColor: record?.color,
                                        border: 0,
                                        cursor: 'pointer',
                                    }}
                                />
                            }
                            value={{ 'tags@cs': `{${record.id}}` }}
                        />
                    ))}
            </FilterList>
            <FilterList label="Tasks" icon={<AssignmentTurnedInIcon />}>
                <FilterListItem
                    label="With pending tasks"
                    value={{ 'nb_tasks@gt': 0 }}
                />
            </FilterList>
            <FilterList
                label="Account manager"
                icon={<SupervisorAccountIcon />}
            >
                <FilterListItem label="Me" value={{ sales_id: identity?.id }} />
            </FilterList>
        </Box>
    );
};
