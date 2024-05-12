import * as React from 'react';
import { useState, MouseEvent } from 'react';
import {
    DateField,
    ReferenceField,
    useUpdate,
    useDeleteWithUndoController,
} from 'react-admin';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const Task = ({
    task,
    showContact,
}: {
    task: any;
    showContact?: boolean;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [update, { isPending: isUpdatePending }] = useUpdate();
    const { handleDelete } = useDeleteWithUndoController({
        record: task,
        redirect: false,
    });

    const handleCheck = () => () => {
        update('tasks', {
            id: task.id,
            data: {
                done_date: task.done_date
                    ? undefined
                    : new Date().toISOString(),
            },
        });
    };
    const labelId = `checkbox-list-label-${task.id}`;
    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton
                        edge="end"
                        aria-label="task actions"
                        aria-controls={open ? 'basic-menu' : undefined}
                        onClick={handleClick}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        size="small"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                update('tasks', {
                                    id: task.id,
                                    data: {
                                        due_date: new Date(
                                            Date.now() + 24 * 60 * 60 * 1000
                                        )
                                            .toISOString()
                                            .slice(0, 10),
                                    },
                                });
                                handleClose();
                            }}
                        >
                            Postpone to tomorrow
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                update('tasks', {
                                    id: task.id,
                                    data: {
                                        due_date: new Date(
                                            Date.now() + 7 * 24 * 60 * 60 * 1000
                                        )
                                            .toISOString()
                                            .slice(0, 10),
                                    },
                                });
                                handleClose();
                            }}
                        >
                            Postpone to next week
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </>
            }
            disableGutters
            sx={{ pr: 3 }}
        >
            <ListItemButton
                role={undefined}
                onClick={handleCheck()}
                dense
                disabled={isUpdatePending}
                sx={{
                    pl: 0,
                    pr: '0!important',
                    pt: 0,
                    pb: 0,
                    alignItems: 'flex-start',
                }}
            >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <Checkbox
                        edge="start"
                        checked={!!task.done_date}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        sx={{ pt: 0.3 }}
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
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                    >
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
