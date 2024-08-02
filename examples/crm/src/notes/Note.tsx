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
import TrashIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { Avatar } from '../contacts/Avatar';
import { Status } from '../misc/Status';
import { ContactNote, DealNote } from '../types';
import { NoteAttachments } from './NoteAttachments';
import { NoteInputs } from './NoteInputs';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { CompanyAvatar } from '../companies/CompanyAvatar';

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
                    added a note {showStatus && <Status status={note.status} />}
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
                            '& p:first-of-type': {
                                marginTop: 0,
                            },
                            '& p:last-of-type': {
                                marginBottom: 0,
                            },
                        }}
                    >
                        {note.text
                            ?.split('\n')
                            .map((paragraph: string, index: number) => (
                                <Box
                                    component="p"
                                    fontFamily="fontFamily"
                                    fontSize="body2.fontSize"
                                    lineHeight={1.5}
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
