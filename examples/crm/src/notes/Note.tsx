import * as React from 'react';
import { useState, FormEvent, ChangeEvent } from 'react';
import {
    TextField,
    ReferenceField,
    DateField,
    useResourceContext,
    useDelete,
    useUpdate,
    useNotify,
    useRecordContext,
} from 'react-admin';
import {
    Box,
    Typography,
    Tooltip,
    IconButton,
    FilledInput,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';

import { Status } from '../misc/Status';

export const Note = ({
    showStatus,
    note,
    isLast,
    reference,
}: {
    showStatus?: boolean;
    note: any;
    isLast: boolean;
    reference: string;
}) => {
    const [isHover, setHover] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [noteText, setNoteText] = useState(note.text);
    const resource = useResourceContext();
    const record = useRecordContext();
    const notify = useNotify();

    const [update, { isLoading }] = useUpdate();

    const [deleteNote] = useDelete(
        resource,
        { id: note.id, previousData: note },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('Note deleted', { type: 'info', undoable: true });
                update(reference, {
                    id: record.id,
                    data: { nb_notes: record.nb_notes - 1 },
                    previousData: record,
                });
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
        setNoteText(note.text);
        setHover(false);
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNoteText(event.target.value);
    };

    const handleNoteUpdate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        update(
            resource,
            { id: note.id, data: { text: noteText }, previousData: note },
            {
                onSuccess: () => {
                    setEditing(false);
                    setNoteText(note.text);
                    setHover(false);
                },
            }
        );
    };

    return (
        <Box
            sx={{ marginBottom: 2 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Box
                sx={{
                    marginBottom: 1,
                    color: 'text.secondary',
                }}
            >
                <ReferenceField
                    record={note}
                    resource="contactNotes"
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
                <form onSubmit={handleNoteUpdate}>
                    <FilledInput
                        value={noteText}
                        onChange={handleTextChange}
                        fullWidth
                        multiline
                        sx={{
                            paddingTop: '16px',
                            paddingLeft: '14px',
                            paddingRight: '60px',
                            paddingBottom: '14px',
                            lineHeight: 1.3,
                        }}
                        autoFocus
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 1,
                        }}
                    >
                        <Button
                            sx={{ marginRight: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                        >
                            Update Note
                        </Button>
                    </Box>
                </form>
            ) : (
                <Box
                    sx={{
                        bgcolor: '#edf3f0',
                        padding: '0 1em',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'stretch',
                        marginBottom: 1,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        {note.text
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                                <Box
                                    component="p"
                                    sx={{
                                        fontFamily: 'fontFamily',
                                        fontSize: 'body1.fontSize',
                                        lineHeight: 1.3,
                                        marginBottom: 2.4,
                                    }}
                                    key={index}
                                >
                                    {paragraph}
                                </Box>
                            ))}
                    </Box>
                    <Box
                        sx={{
                            marginLeft: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
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
