import ContentSave from '@mui/icons-material/Save';
import {
    Box,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import {
    DateField,
    Form,
    ReferenceField,
    TextField,
    useDelete,
    useNotify,
    useResourceContext,
    useUpdate,
} from 'react-admin';

import TrashIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { Status } from '../misc/Status';
import { ContactNote, DealNote } from '../types';
import { NoteAttachments } from './NoteAttachments';
import { NoteInputs } from './NoteInputs';

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
        setEditing(!isEditing);
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
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box color="text.secondary">
                    <ReferenceField
                        record={note}
                        resource={resource}
                        source="sales_id"
                        reference="sales"
                    >
                        <TextField source="first_name" variant="body2" />
                    </ReferenceField>{' '}
                    <Typography component="span" variant="body2">
                        added a note on{' '}
                    </Typography>
                    <DateField
                        source="date"
                        record={note}
                        variant="body2"
                        showTime
                        locales="en"
                        options={{
                            dateStyle: 'full',
                            timeStyle: 'short',
                        }}
                    />{' '}
                    {showStatus && <Status status={note.status} />}
                </Box>
                <Box
                    sx={{
                        visibility: isHover ? 'visible' : 'hidden',
                    }}
                >
                    <Tooltip title="Edit note">
                        <IconButton size="small" onClick={handleEnterEditMode}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete note">
                        <IconButton size="small" onClick={handleDelete}>
                            <TrashIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>
            {isEditing ? (
                <Form onSubmit={handleNoteUpdate} record={note}>
                    <NoteInputs showStatus={showStatus} edition />
                    <Box display="flex" justifyContent="flex-start" mt={1}>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isPending}
                            startIcon={<ContentSave />}
                        >
                            Update Note
                        </Button>
                        <Button
                            sx={{ mr: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Form>
            ) : (
                <Box
                    sx={{
                        paddingTop: '0.5em',
                        display: 'flex',
                        alignItems: 'stretch',
                    }}
                >
                    <Box
                        flex={1}
                        sx={{
                            maxWidth: '80%',
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
                                    fontSize="body2.fontSize"
                                    lineHeight={1.3}
                                    marginBottom={2.4}
                                    key={index}
                                >
                                    {paragraph}
                                </Box>
                            ))}

                        {note.attachments && <NoteAttachments note={note} />}
                    </Box>
                </Box>
            )}
        </Box>
    );
};
