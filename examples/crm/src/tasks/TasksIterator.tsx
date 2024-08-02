import * as React from 'react';
import { useListContext } from 'react-admin';
import { isAfter } from 'date-fns';
import { List, SxProps } from '@mui/material';

import { Task } from './Task';

export const TasksIterator = ({
    showContact,
    sx,
}: {
    showContact?: boolean;
    sx?: SxProps;
}) => {
    const { data, error, isPending } = useListContext();
    if (isPending || error || data.length === 0) return null;

    // Keep only tasks that are not done or done less than 5 minutes ago
    const tasks = data.filter(
        task =>
            !task.done_date ||
            isAfter(
                new Date(task.done_date),
                new Date(Date.now() - 5 * 60 * 1000)
            )
    );

    return (
        <List dense sx={sx}>
            {tasks.map(task => (
                <Task task={task} showContact={showContact} key={task.id} />
            ))}
        </List>
    );
};
