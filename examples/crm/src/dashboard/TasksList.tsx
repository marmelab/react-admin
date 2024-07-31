import * as React from 'react';
import { Card, Box, Typography, Stack } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {
    useGetList,
    Link,
    useGetIdentity,
    useList,
    ListContextProvider,
    ResourceContextProvider,
} from 'react-admin';
import { TasksIterator } from '../tasks/TasksIterator';

import { Contact } from '../types';
import { AddTask } from '../tasks/AddTask';
import { startOfToday, endOfToday, addDays } from 'date-fns';

const today = new Date();
const startOfTodayDateISO = startOfToday().toISOString();
const endOfTodayDateISO = endOfToday().toISOString();
const startOfWeekDateISO = addDays(today, 1).toISOString();
const endOfWeekDateISO = addDays(today, 7).toISOString();

export const TasksList = () => {
    const { identity } = useGetIdentity();

    const { data: contacts, isPending: contactsLoading } = useGetList<Contact>(
        'contacts',
        {
            pagination: { page: 1, perPage: 500 },
            filter: { sales_id: identity?.id },
        },
        { enabled: !!identity }
    );

    const {
        data: overdueTasks,
        total: overdueTotal,
        isPending: overdueTasksLoading,
    } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {
                done_date: undefined,
                due_date_lt: startOfTodayDateISO,
                contact_id: contacts?.map(contact => contact.id),
            },
        },
        { enabled: !!contacts }
    );

    const {
        data: todayTasks,
        total: todayTotal,
        isPending: todayTasksLoading,
    } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {
                done_date: undefined,
                due_date_gte: startOfTodayDateISO,
                due_date_lte: endOfTodayDateISO,
                contact_id: contacts?.map(contact => contact.id),
            },
        },
        { enabled: !!contacts }
    );

    const {
        data: thisWeekTasks,
        total: thisWeekTotal,
        isPending: thisWeekTasksLoading,
    } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {
                done_date: undefined,
                due_date_gte: startOfWeekDateISO,
                due_date_lte: endOfWeekDateISO,
                contact_id: contacts?.map(contact => contact.id),
            },
        },
        { enabled: !!contacts }
    );

    const {
        data: laterTasks,
        total: laterTotal,
        isPending: laterTasksLoading,
    } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {
                done_date: undefined,
                due_date_gt: endOfWeekDateISO,
                contact_id: contacts?.map(contact => contact.id),
            },
        },
        { enabled: !!contacts }
    );

    const isPending =
        overdueTasksLoading ||
        todayTasksLoading ||
        thisWeekTasksLoading ||
        laterTasksLoading ||
        contactsLoading;

    const listOverdueContext = useList({
        data: overdueTasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    const listTodayContext = useList({
        data: todayTasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    const listThisWeekContext = useList({
        data: thisWeekTasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    const listLaterContext = useList({
        data: laterTasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <AssignmentTurnedInIcon color="disabled" fontSize="large" />
                </Box>
                <Link
                    underline="none"
                    variant="h5"
                    color="textSecondary"
                    to="/contacts"
                >
                    Upcoming tasks
                </Link>
            </Box>
            <Card sx={{ px: 2, mb: '2em' }}>
                <AddTask selectContact />
                <Stack gap={3} mt={2}>
                    <Stack>
                        <Typography variant="body1" fontWeight="bold">
                            Overdue
                        </Typography>
                        <ResourceContextProvider value="tasks">
                            <ListContextProvider value={listOverdueContext}>
                                <TasksIterator showContact />
                            </ListContextProvider>
                        </ResourceContextProvider>
                        {!isPending &&
                            overdueTotal &&
                            overdueTotal > listOverdueContext.perPage && (
                                <Stack
                                    justifyContent="flex-end"
                                    direction="row"
                                >
                                    <Typography
                                        onClick={() =>
                                            listOverdueContext.setPerPage(
                                                listOverdueContext.perPage + 10
                                            )
                                        }
                                        variant="caption"
                                        sx={{ cursor: 'pointer' }}
                                        color="text.primary"
                                    >
                                        5 more
                                    </Typography>
                                </Stack>
                            )}
                    </Stack>

                    <Stack>
                        <Typography variant="body1" fontWeight="bold">
                            Today
                        </Typography>
                        <ResourceContextProvider value="tasks">
                            <ListContextProvider value={listTodayContext}>
                                <TasksIterator showContact />
                            </ListContextProvider>
                        </ResourceContextProvider>
                        {!isPending &&
                            todayTotal &&
                            todayTotal > listTodayContext.perPage && (
                                <Stack
                                    justifyContent="flex-end"
                                    direction="row"
                                >
                                    <Typography
                                        onClick={() =>
                                            listTodayContext.setPerPage(
                                                listTodayContext.perPage + 10
                                            )
                                        }
                                        variant="caption"
                                        sx={{ cursor: 'pointer' }}
                                        color="text.primary"
                                    >
                                        5 more
                                    </Typography>
                                </Stack>
                            )}
                    </Stack>
                    <Stack>
                        <Typography variant="body1" fontWeight="bold">
                            This week
                        </Typography>
                        <ResourceContextProvider value="tasks">
                            <ListContextProvider value={listThisWeekContext}>
                                <TasksIterator showContact />
                            </ListContextProvider>
                        </ResourceContextProvider>
                        {!isPending &&
                            thisWeekTotal &&
                            thisWeekTotal > listThisWeekContext.perPage && (
                                <Stack
                                    justifyContent="flex-end"
                                    direction="row"
                                >
                                    <Typography
                                        onClick={() =>
                                            listThisWeekContext.setPerPage(
                                                listThisWeekContext.perPage + 10
                                            )
                                        }
                                        variant="caption"
                                        sx={{ cursor: 'pointer' }}
                                        color="text.primary"
                                    >
                                        5 more
                                    </Typography>
                                </Stack>
                            )}
                    </Stack>

                    <Stack>
                        <Typography variant="body1" fontWeight="bold">
                            Later
                        </Typography>
                        <ResourceContextProvider value="tasks">
                            <ListContextProvider value={listLaterContext}>
                                <TasksIterator showContact />
                            </ListContextProvider>
                        </ResourceContextProvider>
                        {!isPending &&
                            laterTotal &&
                            laterTotal > listLaterContext.perPage && (
                                <Stack
                                    justifyContent="flex-end"
                                    direction="row"
                                >
                                    <Typography
                                        onClick={() =>
                                            listLaterContext.setPerPage(
                                                listLaterContext.perPage + 10
                                            )
                                        }
                                        variant="caption"
                                        color="text.primary"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        5 more
                                    </Typography>
                                </Stack>
                            )}
                    </Stack>
                </Stack>
            </Card>
        </>
    );
};
