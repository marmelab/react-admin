import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import * as React from 'react';
import { MouseEvent, useState } from 'react';
import {
    DateField,
    ReferenceField,
    useDeleteWithUndoController,
    useUpdate,
} from 'react-admin';
import { TaskEdit } from './TaskEdit';

export const Task = ({
    task,
    showContact,
}: {
    task: any;
    showContact?: boolean;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openEdit, setOpenEdit] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const [update, { isPending: isUpdatePending }] = useUpdate();
    const { handleDelete } = useDeleteWithUndoController({
        record: task,
        redirect: false,
    });

    const handleEdit = () => {
        setAnchorEl(null);
        setOpenEdit(true);
    };

    const handleCheck = () => () => {
        update('tasks', {
            id: task.id,
            data: {
                done_date: task.done_date ? null : new Date().toISOString(),
            },
            previousData: task,
        });
    };
    const labelId = `checkbox-list-label-${task.id}`;
    return (
        <>
            <ListItem
                secondaryAction={
                    <>
                        <IconButton
                            edge="end"
                            aria-label="task actions"
                            aria-controls={
                                open ? `task-${task.id}-menu` : undefined
                            }
                            onClick={handleClick}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            size="small"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id={`task-${task.id}-menu`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
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
                                        previousData: task,
                                    });
                                    handleCloseMenu();
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
                                                Date.now() +
                                                    7 * 24 * 60 * 60 * 1000
                                            )
                                                .toISOString()
                                                .slice(0, 10),
                                        },
                                        previousData: task,
                                    });
                                    handleCloseMenu();
                                }}
                            >
                                Postpone to next week
                            </MenuItem>
                            <MenuItem onClick={handleEdit}>Edit</MenuItem>
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
                                <Typography component="strong" variant="body2">
                                    {task.type}
                                </Typography>
                                &nbsp;
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
                                        link="show"
                                    />
                                    )
                                </>
                            )}
                        </Typography>
                    </ListItemText>
                </ListItemButton>
            </ListItem>

            {/* This part is for editing the Task directly via a Dialog */}
            <TaskEdit
                taskId={task.id}
                open={openEdit}
                close={handleCloseEdit}
            />
        </>
    );
};
