import {
    ListContextProvider,
    ResourceContextProvider,
    useGetIdentity,
    useGetList,
    useList,
} from 'react-admin';
import { Link, Stack, Typography } from '@mui/material';

import { TasksIterator } from '../tasks/TasksIterator';

export const TasksListFilter = ({
    title,
    filter,
}: {
    title: string;
    filter: any;
}) => {
    const { identity } = useGetIdentity();

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
                sales_id: identity?.id,
            },
        },
        { enabled: !!identity }
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
            <Typography variant="overline">{title}</Typography>
            <ResourceContextProvider value="tasks">
                <ListContextProvider value={listContext}>
                    <TasksIterator showContact sx={{ pt: 0, pb: 0 }} />
                </ListContextProvider>
            </ResourceContextProvider>
            {total > listContext.perPage && (
                <Stack justifyContent="flex-end" direction="row">
                    <Link
                        href="#"
                        onClick={e => {
                            listContext.setPerPage(listContext.perPage + 10);
                            e.preventDefault();
                        }}
                        variant="body2"
                    >
                        Load more
                    </Link>
                </Stack>
            )}
        </Stack>
    );
};
