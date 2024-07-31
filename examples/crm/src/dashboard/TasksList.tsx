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

const taskFilters = {
    overdue: { done_date: undefined, due_date_lt: startOfTodayDateISO },
    today: {
        done_date: undefined,
        due_date_gte: startOfTodayDateISO,
        due_date_lte: endOfTodayDateISO,
    },
    thisWeek: {
        done_date: undefined,
        due_date_gte: startOfWeekDateISO,
        due_date_lte: endOfWeekDateISO,
    },
    later: { done_date: undefined, due_date_gt: endOfWeekDateISO },
};

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

    if (contactsLoading || !contacts) return null;

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
                    <TaskListFilter
                        title="Overdue"
                        filter={taskFilters.overdue}
                        contacts={contacts}
                    />
                    <TaskListFilter
                        title="Today"
                        filter={taskFilters.today}
                        contacts={contacts}
                    />
                    <TaskListFilter
                        title="This week"
                        filter={taskFilters.thisWeek}
                        contacts={contacts}
                    />
                    <TaskListFilter
                        title="Later"
                        filter={taskFilters.later}
                        contacts={contacts}
                    />
                </Stack>
            </Card>
        </>
    );
};

const TaskListFilter = ({
    title,
    filter,
    contacts,
}: {
    title: string;
    filter: any;
    contacts: Contact[];
}) => {
    const {
        data: tasks,
        total,
        isPending,
    } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {
                ...filter,
                contact_id: contacts.map(contact => contact.id),
            },
        },
        { enabled: !!contacts }
    );

    const listContext = useList({
        data: tasks,
        isPending,
        resource: 'tasks',
        perPage: 5,
    });

    if (isPending || !tasks || !total) return null;

    return (
        <Stack>
            <Typography variant="body1" fontWeight="bold">
                {title}
            </Typography>
            <ResourceContextProvider value="tasks">
                <ListContextProvider value={listContext}>
                    <TasksIterator showContact />
                </ListContextProvider>
            </ResourceContextProvider>
            {total > listContext.perPage && (
                <Stack justifyContent="flex-end" direction="row">
                    <Typography
                        onClick={() =>
                            listContext.setPerPage(listContext.perPage + 10)
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
    );
};
