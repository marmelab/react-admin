import TrashIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentSave from '@mui/icons-material/Save';
import {
    Box,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    Form,
    ReferenceField,
    useDelete,
    useNotify,
    useResourceContext,
    useUpdate,
    WithRecord,
} from 'react-admin';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { Avatar } from '../contacts/Avatar';
import { RelativeDate } from '../misc/RelativeDate';
import { Status } from '../misc/Status';
import { SaleName } from '../sales/SaleName';
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
            pb={1}
        >
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                {resource === 'contactNote' ? (
                    <Avatar width={20} height={20} />
                ) : (
                    <ReferenceField
                        source="company_id"
                        reference="companies"
                        link="show"
                    >
                        <CompanyAvatar width={20} height={20} />
                    </ReferenceField>
                )}
                <Typography color="text.secondary" variant="body2">
                    <ReferenceField
                        record={note}
                        resource={resource}
                        source="sales_id"
                        reference="sales"
                        link={false}
                    >
                        <WithRecord
                            render={record => <SaleName sale={record} />}
                        />
                    </ReferenceField>{' '}
                    added a note{' '}
                    {showStatus && note.status && (
                        <Status status={note.status} />
                    )}
                    <Box
                        component="span"
                        sx={{
                            ml: 2,
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
                </Typography>
                <Box flex={1}></Box>
                <Typography
                    color="textSecondary"
                    variant="body2"
                    component="span"
                >
                    <RelativeDate date={note.date} />
                </Typography>
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
                            sx={{ ml: 1 }}
                            onClick={handleCancelEdit}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Form>
            ) : (
                <Stack
                    sx={{
                        paddingTop: '0.5em',
                        display: 'flex',
                        '& p:empty': {
                            minHeight: '0.75em',
                        },
                    }}
                >
                    {note.text
                        ?.split('\n')
                        .map((paragraph: string, index: number) => (
                            <Typography
                                component="p"
                                variant="body2"
                                lineHeight={1.5}
                                margin={0}
                                key={index}
                            >
                                {paragraph}
                            </Typography>
                        ))}

                    {note.attachments && <NoteAttachments note={note} />}
                </Stack>
            )}
        </Box>
    );
};
