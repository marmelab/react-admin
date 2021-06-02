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
    Typography,
    Tooltip,
    IconButton,
    FilledInput,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import TrashIcon from '@material-ui/icons/Delete';

import { Status } from '../misc/Status';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(2),
    },
    metadata: {
        marginBottom: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
    textarea: {
        paddingTop: 16,
        paddingLeft: 14,
        paddingRight: 60,
        paddingBottom: 14,
        lineHeight: 1.3,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(1),
    },
    cancel: {
        marginRight: theme.spacing(1),
    },
    content: {
        backgroundColor: '#edf3f0',
        padding: '0 1em',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'stretch',
        marginBottom: theme.spacing(1),
    },
    text: {
        flex: 1,
    },
    paragraph: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body1.fontSize,
        lineHeight: 1.3,
        marginBottom: theme.spacing(2.4),
    },
    toolbar: {
        marginLeft: theme.spacing(2),
        visibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
}));

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
    const classes = useStyles();
    const [update, { loading }] = useUpdate();

    const [handleDelete] = useDelete(resource, note.id, note, {
        mutationMode: 'undoable',
        onSuccess: () => {
            notify('Note deleted', undefined, undefined, true);
            update(
                reference,
                record.id,
                { nb_notes: record.nb_notes - 1 },
                record
            );
        },
    });

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
        update(resource, note.id, { text: noteText }, note, {
            onSuccess: () => {
                setEditing(false);
                setNoteText(note.text);
                setHover(false);
            },
        });
    };

    return (
        <div
            className={classes.root}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className={classes.metadata}>
                <ReferenceField
                    record={note}
                    resource="contactNotes"
                    source="sales_id"
                    reference="sales"
                    basePath="/contactNotes"
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
            </div>
            {isEditing ? (
                <form onSubmit={handleNoteUpdate}>
                    <FilledInput
                        value={noteText}
                        onChange={handleTextChange}
                        fullWidth
                        multiline
                        className={classes.textarea}
                        autoFocus
                    />
                    <div className={classes.buttons}>
                        <Button
                            className={classes.cancel}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={loading}
                        >
                            Update Note
                        </Button>
                    </div>
                </form>
            ) : (
                <div className={classes.content}>
                    <div className={classes.text}>
                        {note.text
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                                <p className={classes.paragraph} key={index}>
                                    {paragraph}
                                </p>
                            ))}
                    </div>
                    <div
                        className={classes.toolbar}
                        style={{ visibility: isHover ? 'visible' : 'hidden' }}
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
                    </div>
                </div>
            )}
        </div>
    );
};
