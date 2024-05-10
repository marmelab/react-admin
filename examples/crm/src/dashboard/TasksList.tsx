import * as React from 'react';
import { Card, Box } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
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

export const TasksList = () => {
    const { identity } = useGetIdentity();
    const {
        data: contacts,
        error: contactsError,
        isPending: contactsLoading,
    } = useGetList<Contact>(
        'contacts',
        {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'last_seen', order: 'DESC' },
            filter: { status: 'hot', sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );
    const { data: tasks, isPending: tasksLoading } = useGetList(
        'tasks',
        {
            pagination: { page: 1, perPage: 5 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: { contact_id: contacts?.map(contact => contact.id) },
        },
        {
            enabled: !contactsLoading && !contactsError,
        }
    );
    const listContext = useList({
        data: tasks,
        isPending: tasksLoading,
        resource: 'tasks',
    });
    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <ContactsIcon color="disabled" fontSize="large" />
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
                <ResourceContextProvider value="tasks">
                    <ListContextProvider value={listContext}>
                        <TasksIterator showContact />
                    </ListContextProvider>
                </ResourceContextProvider>
            </Card>
        </>
    );
};
