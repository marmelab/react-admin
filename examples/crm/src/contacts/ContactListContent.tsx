/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    BulkActionsToolbar,
    BulkDeleteButton,
    RecordContextProvider,
    ReferenceField,
    SimpleListLoading,
    TextField,
    useListContext,
} from 'react-admin';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Checkbox,
    Typography,
    useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

import { Avatar } from './Avatar';
import { Status } from '../misc/Status';
import { TagsList } from './TagsList';
import { Contact } from '../types';

export const ContactListContent = () => {
    const {
        data: contacts,
        error,
        isPending,
        onToggleItem,
        selectedIds,
    } = useListContext<Contact>();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    if (isPending) {
        return <SimpleListLoading hasLeftAvatarOrIcon hasSecondaryText />;
    }
    if (error) {
        return null;
    }
    const now = Date.now();

    return (
        <>
            <BulkActionsToolbar>
                <BulkDeleteButton />
            </BulkActionsToolbar>
            <List dense>
                {contacts.map(contact => (
                    <RecordContextProvider key={contact.id} value={contact}>
                        <ListItem
                            button
                            component={Link}
                            to={`/contacts/${contact.id}/show`}
                        >
                            <ListItemIcon sx={{ minWidth: '2.5em' }}>
                                <Checkbox
                                    edge="start"
                                    checked={selectedIds.includes(contact.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    onClick={e => {
                                        e.stopPropagation();
                                        onToggleItem(contact.id);
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemAvatar>
                                <Avatar />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${contact.first_name} ${contact.last_name}`}
                                secondary={
                                    <>
                                        {contact.title} at{' '}
                                        <ReferenceField
                                            source="company_id"
                                            reference="companies"
                                            link={false}
                                        >
                                            <TextField source="name" />
                                        </ReferenceField>
                                        {contact.nb_tasks
                                            ? ` - ${contact.nb_tasks} task${
                                                  contact.nb_tasks > 1
                                                      ? 's'
                                                      : ''
                                              }`
                                            : ''}
                                        &nbsp;&nbsp;
                                        <TagsList />
                                    </>
                                }
                            />
                            <ListItemSecondaryAction
                                sx={{
                                    top: '10px',
                                    transform: 'none',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    title={contact.last_seen}
                                >
                                    {!isSmall && 'last activity '}
                                    {formatDistance(
                                        contact.last_seen,
                                        now
                                    )} ago <Status status={contact.status} />
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </RecordContextProvider>
                ))}

                {contacts.length === 0 && (
                    <ListItem>
                        <ListItemText primary="No contacts found" />
                    </ListItem>
                )}
            </List>
        </>
    );
};
