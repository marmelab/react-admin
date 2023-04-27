import * as React from 'react';
import { useState, FormEvent } from 'react';
import {
    useRecordContext,
    useListContext,
    useCreate,
    useUpdate,
    useNotify,
    useGetIdentity,
    Identifier,
    useResourceContext,
} from 'react-admin';
import { Box, TextField as TextInput, Button } from '@mui/material';

import { StatusSelector } from './StatusSelector';

export const NewNote = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'contacts' | 'deals';
}) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { refetch } = useListContext();
    const [text, setText] = useState('');
    const [status, setStatus] = useState(record && record.status);
    const [date, setDate] = useState(getCurrentDate());
    const [create, { isLoading }] = useCreate();
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity } = useGetIdentity();
    if (!record || !identity) return null;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: any = {
            [foreignKeyMapping[reference]]: record.id,
            sales_id: identity.id,
            date,
            text,
        };
        if (showStatus) {
            data.status = status;
        }
        create(
            resource,
            { data },
            {
                onSuccess: () => {
                    setText('');
                    notify('Note added successfully');
                    refetch();
                    update(reference, {
                        id: ((record && record.id) as unknown) as Identifier,
                        data: {
                            last_seen: date,
                            status,
                            nb_notes: record.nb_notes + 1,
                        },
                        previousData: record,
                    });
                },
            }
        );
        return false;
    };
    return (
        <Box mt={4} mb={1}>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Add a note"
                    variant="filled"
                    size="small"
                    fullWidth
                    multiline
                    value={text}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setText(event.target.value)
                    }
                    rows={3}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                    <span>
                        {text ? (
                            <>
                                {showStatus && (
                                    <StatusSelector
                                        status={status}
                                        setStatus={setStatus}
                                        sx={{
                                            marginRight: '1em',
                                            '& .MuiFilledInput-input': {
                                                paddingTop: '10px',
                                            },
                                            width: 150,
                                        }}
                                    />
                                )}
                                <TextInput
                                    type="datetime-local"
                                    variant="filled"
                                    size="small"
                                    value={date}
                                    onChange={(
                                        event: React.ChangeEvent<
                                            HTMLInputElement
                                        >
                                    ) => {
                                        setDate(event.target.value);
                                    }}
                                    sx={{
                                        marginRight: '1em',
                                        '& .MuiFilledInput-input': {
                                            paddingTop: '10px',
                                        },
                                    }}
                                />
                            </>
                        ) : null}
                    </span>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!text || isLoading}
                    >
                        Add this note
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

const getCurrentDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, -1);
};

const foreignKeyMapping = {
    contacts: 'contact_id',
    deals: 'deal_id',
};
