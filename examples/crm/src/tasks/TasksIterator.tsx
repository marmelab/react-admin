import * as React from 'react';
import {
    DateField,
    ReferenceField,
    useListContext,
    useUpdate,
} from 'react-admin';
import { isAfter } from 'date-fns';
import {
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

export const TasksIterator = ({ showContact }: { showContact?: boolean }) => {
    const { data, error, isPending } = useListContext();
    const [update, { isPending: isUpdatePending }] = useUpdate();
    if (isPending || error || data.length === 0) return null;

    // Keep only tasks that are not done or done less than 24 hours ago
    const tasks = data.filter(
        task =>
            !task.done_date ||
            isAfter(
                new Date(task.done_date),
                new Date(Date.now() - 24 * 60 * 60 * 1000)
            )
    );

    const handleCheck = (id: number) => () => {
        update('tasks', { id, data: { done_date: new Date().toISOString() } });
    };

    return (
        <List>
            {tasks.map(task => {
                const labelId = `checkbox-list-label-${task.id}`;
                return (
                    <ListItem key={task.id} disableGutters>
                        <ListItemButton
                            role={undefined}
                            onClick={handleCheck(task.id)}
                            dense
                            disabled={isUpdatePending}
                            sx={{ pl: 0, pr: 0 }}
                        >
                            <ListItemIcon sx={{ minWidth: 'auto' }}>
                                <Checkbox
                                    edge="start"
                                    checked={!!task.done_date}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    textDecoration: !!task.done_date
                                        ? 'line-through'
                                        : 'none',
                                }}
                            >
                                {task.type && (
                                    <>
                                        <strong>{task.type}</strong>&nbsp;
                                    </>
                                )}
                                {task.text}
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    due{' '}
                                    <DateField
                                        source="due_date"
                                        record={task}
                                    />
                                    {showContact && (
                                        <>
                                            &nbsp;(Re:{' '}
                                            <ReferenceField
                                                source="contact_id"
                                                reference="contacts"
                                                record={task}
                                            />
                                            )
                                        </>
                                    )}
                                </Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};
