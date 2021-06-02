import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';
import NoteIcon from '@material-ui/icons/Note';
import { makeStyles } from '@material-ui/core/styles';
import {
    useGetList,
    useGetIdentity,
    ReferenceField,
    TextField,
    FunctionField,
} from 'react-admin';
import { formatDistance } from 'date-fns';

import { Contact as ContactType } from '../types';

const useStyles = makeStyles(theme => ({
    note: {
        marginBottom: theme.spacing(2),
    },
    noteText: {
        backgroundColor: '#edf3f0',
        padding: theme.spacing(1),
        borderRadius: 10,
    },
    noteTextText: {
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
}));

export const LatestNotes = () => {
    const classes = useStyles();
    const { identity } = useGetIdentity();
    const {
        data: contactNotesData,
        ids: contactNotesIds,
        loaded: contactNotesLoaded,
    } = useGetList(
        'contactNotes',
        { page: 1, perPage: 5 },
        { field: 'date', order: 'DESC' },
        { sales_id: identity?.id },
        { enabled: Number.isInteger(identity?.id) }
    );
    const {
        data: dealNotesData,
        ids: dealNotesIds,
        loaded: dealNotesLoaded,
    } = useGetList(
        'dealNotes',
        { page: 1, perPage: 5 },
        { field: 'date', order: 'DESC' },
        { sales_id: identity?.id },
        { enabled: Number.isInteger(identity?.id) }
    );
    if (!contactNotesLoaded || !dealNotesLoaded) {
        return null;
    }
    // TypeScript guards
    if (
        !contactNotesIds ||
        !contactNotesData ||
        !dealNotesIds ||
        !dealNotesData
    ) {
        return null;
    }

    const allNotes = ([] as any[])
        .concat(
            contactNotesIds.map(id => ({
                ...contactNotesData[id],
                type: 'contactNote',
            })),
            dealNotesIds.map(id => ({ ...dealNotesData[id], type: 'dealNote' }))
        )
        .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
        .slice(0, 5);

    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <NoteIcon color="disabled" fontSize="large" />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    My Latest Notes
                </Typography>
            </Box>
            <Card>
                <CardContent>
                    {allNotes.map(note => (
                        <div
                            id={`${note.type}_${note.id}`}
                            key={`${note.type}_${note.id}`}
                            className={classes.note}
                        >
                            <Typography color="textSecondary" gutterBottom>
                                on{' '}
                                {note.type === 'dealNote' ? (
                                    <Deal note={note} />
                                ) : (
                                    <Contact note={note} />
                                )}
                                , added{' '}
                                {formatDistance(
                                    new Date(note.date),
                                    new Date(),
                                    {
                                        addSuffix: true,
                                    }
                                )}
                            </Typography>
                            <div className={classes.noteText}>
                                <Typography className={classes.noteTextText}>
                                    {note.text}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
};

const Deal = ({ note }: any) => (
    <>
        Deal{' '}
        <ReferenceField
            record={note}
            source="deal_id"
            reference="deals"
            basePath="/deals"
            link="show"
        >
            <TextField source="name" variant="body1" />
        </ReferenceField>
    </>
);

const Contact = ({ note }: any) => (
    <>
        Contact{' '}
        <ReferenceField
            record={note}
            source="contact_id"
            reference="contacts"
            basePath="/contacts"
            link="show"
        >
            <FunctionField<ContactType>
                variant="body1"
                render={contact =>
                    contact ? `${contact.first_name} ${contact.last_name}` : ''
                }
            />
        </ReferenceField>
    </>
);
