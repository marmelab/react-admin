import * as React from 'react';
import {
    TextField,
    EmailField,
    DateField,
    ReferenceManyField,
    EditButton,
    ShowButton,
    useListContext,
    ReferenceField,
    FunctionField,
    useRecordContext,
} from 'react-admin';
import { Box, Typography, Divider, List, ListItem } from '@mui/material';
import { TagsListEdit } from './TagsListEdit';

import { Contact, Sale } from '../types';

export const ContactAside = ({ link = 'edit' }: { link?: 'edit' | 'show' }) => {
    const record = useRecordContext<Contact>();
    return (
        <Box ml={4} width={250} minWidth={250}>
            <Box textAlign="center" mb={2}>
                {link === 'edit' ? (
                    <EditButton label="Edit Contact" />
                ) : (
                    <ShowButton label="Show Contact" />
                )}
            </Box>
            <Typography variant="subtitle2">Personal info</Typography>
            <Divider />
            <EmailField
                sx={{ mt: 2, mb: 1, display: 'block' }}
                source="email"
            />
            <TextField source="phone_number1" />{' '}
            <Typography variant="body2" color="textSecondary" component="span">
                Work
            </Typography>
            <Box mb={1}>
                <TextField source="phone_number2" />{' '}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                >
                    Home
                </Typography>
            </Box>
            <Typography variant="body2" mb={3}>
                {record.gender === 'male' ? 'He/Him' : 'She/Her'}
            </Typography>
            <Typography variant="subtitle2">Background</Typography>
            <Divider />
            <Typography variant="body2" mt={2}>
                {record && record.background}
            </Typography>
            <Box mt={1} mb={3}>
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Added on
                </Typography>{' '}
                <DateField
                    source="first_seen"
                    options={{ year: 'numeric', month: 'long', day: 'numeric' }}
                    color="textSecondary"
                />
                <br />
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Last seen on
                </Typography>{' '}
                <DateField
                    source="last_seen"
                    options={{ year: 'numeric', month: 'long', day: 'numeric' }}
                    color="textSecondary"
                />
                <br />
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Followed by
                </Typography>{' '}
                <ReferenceField source="sales_id" reference="sales">
                    <FunctionField<Sale>
                        source="last_name"
                        render={record =>
                            `${record.first_name} ${record.last_name}`
                        }
                    />
                </ReferenceField>
            </Box>
            <Box mb={3}>
                <Typography variant="subtitle2">Tags</Typography>
                <Divider />
                <TagsListEdit />
            </Box>
            <ReferenceManyField target="contact_id" reference="tasks">
                <TasksIterator />
            </ReferenceManyField>
        </Box>
    );
};

const TasksIterator = () => {
    const { data, isLoading } = useListContext();
    if (isLoading || data.length === 0) return null;
    return (
        <Box>
            <Typography variant="subtitle2">Tasks</Typography>
            <Divider />

            <List>
                {data.map(task => (
                    <ListItem key={task.id} disableGutters>
                        <Box>
                            <Typography variant="body2">{task.text}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                due{' '}
                                <DateField source="due_date" record={task} />
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
