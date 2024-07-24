import * as React from 'react';
import { useState } from 'react';
import {
    TextField,
    ReferenceField,
    DateField,
    useResourceContext,
    useDelete,
    useUpdate,
    useNotify,
    FileField,
    Form,
    TextInput,
    FileInput,
} from 'react-admin';
import { Box, Typography, Tooltip, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';
import { SubmitHandler, FieldValues } from 'react-hook-form';

import { Status } from '../misc/Status';
import { ContactNote, DealNote } from '../types';
import { NoteAttachments } from './NoteAttachments';

export const Note = ({
    showStatus,
    note,
}: {
    showStatus?: boolean;
    note: DealNote | ContactNote;
    isLast: boolean;
}) => {
    const [isHover, setHover] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const resource = useResourceContext();
    const notify = useNotify();

    const [update, { isPending }] = useUpdate();

    const [deleteNote] = useDelete(
        resource,
        { id: note.id, previousData: note },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('Note deleted', { type: 'info', undoable: true });
            },
        }
    );

    const handleDelete = () => {
        deleteNote();
    };

    const handleEnterEditMode = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setHover(false);
    };

    const handleNoteUpdate: SubmitHandler<FieldValues> = values => {
        update(
            resource,
            { id: note.id, data: values, previousData: note },
            {
                onSuccess: () => {
                    setEditing(false);
                    setHover(false);
                },
            }
        );
    };

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Box color="text.secondary">
                <ReferenceField
                    record={note}
                    resource={resource}
                    source="sales_id"
                    reference="sales"
                >
                    <TextField source="first_name" variant="body1" />
                </ReferenceField>{' '}
                <Typography component="span" variant="body1">
                    added a note on{' '}
                </Typography>
                <DateField
                    source="date"
                    record={note}
                    variant="body1"
                    showTime
                    locales="en"
                    options={{
                        dateStyle: 'full',
                        timeStyle: 'short',
                    }}
                />{' '}
                {showStatus && <Status status={note.status} />}
            </Box>
            {isEditing ? (
                <Form onSubmit={handleNoteUpdate} record={note}>
                    <TextInput
                        source="text"
                        label="Update note"
                        variant="filled"
                        size="small"
                        multiline
                    />
                    <FileInput source="attachments" multiple>
                        <FileField source="src" title="title" />
                    </FileInput>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button
                            sx={{ mr: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isPending}
                        >
                            Update Note
                        </Button>
                    </Box>
                </Form>
            ) : (
                <Box
                    sx={{
                        bgcolor: '#edf3f0',
                        padding: '1em',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'stretch',
                        marginBottom: 1,
                    }}
                >
                    <Box
                        flex={1}
                        sx={{
                            '& p:first-of-type': {
                                marginTop: 0,
                            },
                            '& p:last-of-type': {
                                marginBottom: 0,
                            },
                        }}
                    >
                        {note.text
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                                <Box
                                    component="p"
                                    fontFamily="fontFamily"
                                    fontSize="body1.fontSize"
                                    lineHeight={1.3}
                                    marginBottom={2.4}
                                    key={index}
                                >
                                    {paragraph}
                                </Box>
                            ))}

                        {note.attachments && <NoteAttachments note={note} />}
                    </Box>

                    <Box
                        sx={{
                            marginLeft: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            visibility: isHover ? 'visible' : 'hidden',
                        }}
                    >
                        <Tooltip title="Edit note">
                            <IconButton
                                size="small"
                                onClick={handleEnterEditMode}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note">
                            <IconButton size="small" onClick={handleDelete}>
                                <TrashIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
