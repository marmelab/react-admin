import {
    ListContextProvider,
    ResourceContextProvider,
    useGetList,
    useList,
} from 'react-admin';
import { Contact } from '../types';
import { Stack, Typography } from '@mui/material';
import { TasksIterator } from '../tasks/TasksIterator';

export const TasksListFilter = ({
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
