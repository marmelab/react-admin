/* eslint-disable import/no-anonymous-default-export */
import type { Theme } from '@mui/material';
import {
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { formatRelative } from 'date-fns';
import {
    RecordContextProvider,
    ReferenceField,
    SimpleListLoading,
    TextField,
    useListContext,
} from 'react-admin';
import { Link } from 'react-router-dom';

import { Status } from '../misc/Status';
import { Contact } from '../types';
import { Avatar } from './Avatar';
import { TagsList } from './TagsList';

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
            <List dense>
                {contacts.map(contact => (
                    <RecordContextProvider key={contact.id} value={contact}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={`/contacts/${contact.id}/show`}
                            >
                                <ListItemIcon sx={{ minWidth: '2.5em' }}>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedIds.includes(
                                            contact.id
                                        )}
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
                                    primary={`${contact.first_name} ${contact.last_name ?? ''}`}
                                    secondary={
                                        <>
                                            {contact.title}
                                            {contact.title &&
                                                contact.company_id != null &&
                                                ' at '}
                                            {contact.company_id != null && (
                                                <ReferenceField
                                                    source="company_id"
                                                    reference="companies"
                                                    link={false}
                                                >
                                                    <TextField source="name" />
                                                </ReferenceField>
                                            )}
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
                                {contact.last_seen && (
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
                                            {formatRelative(
                                                contact.last_seen,
                                                now
                                            )}{' '}
                                            <Status status={contact.status} />
                                        </Typography>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItemButton>
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
