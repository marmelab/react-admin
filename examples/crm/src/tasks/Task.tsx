import * as React from 'react';
import { DateField, ReferenceField, useUpdate } from 'react-admin';
import {
    Checkbox,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

export const Task = ({
    task,
    showContact,
}: {
    task: any;
    showContact?: boolean;
}) => {
    const [update, { isPending: isUpdatePending }] = useUpdate();

    const handleCheck = () => () => {
        update('tasks', {
            id: task.id,
            data: { done_date: new Date().toISOString() },
        });
    };
    const labelId = `checkbox-list-label-${task.id}`;
    return (
        <ListItem disableGutters>
            <ListItemButton
                role={undefined}
                onClick={handleCheck()}
                dense
                disabled={isUpdatePending}
                sx={{ pl: 0, pr: 0, pt: 0, pb: 0 }}
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
                    id={labelId}
                >
                    {task.type && task.type !== 'None' && (
                        <>
                            <strong>{task.type}</strong>&nbsp;
                        </>
                    )}
                    {task.text}
                    <Typography variant="body2" color="textSecondary">
                        due <DateField source="due_date" record={task} />
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
};
