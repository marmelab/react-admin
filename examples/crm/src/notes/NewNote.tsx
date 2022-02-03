import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, FormEvent } from 'react';
import {
    useRecordContext,
    useListContext,
    useCreate,
    useUpdate,
    useRefresh,
    useNotify,
    useGetIdentity,
    Identifier,
    useResourceContext,
} from 'react-admin';
import { TextField as TextInput, Button } from '@mui/material';

import { StatusSelector } from './StatusSelector';

const PREFIX = 'NewNote';

const classes = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
    small: `${PREFIX}-small`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1),
    },

    [`& .${classes.toolbar}`]: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1),
    },

    [`& .${classes.small}`]: {
        marginRight: '1em',
        '& .MuiFilledInput-input': {
            paddingTop: 10,
        },
    },
}));

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
        update(reference, {
            id: ((record && record.id) as unknown) as Identifier,
            data: {
                last_seen: date,
                status,
                nb_notes: record.nb_notes + 1,
            },
            previousData: record,
        });
        create(
            resource,
            { data },
            {
                onSuccess: () => {
                    setText('');
                    notify('Note added successfully');
                    refetch();
                },
            }
        );
        return false;
    };
    return (
        <Root className={classes.root}>
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
                <div className={classes.toolbar}>
                    <span>
                        {text ? (
                            <>
                                {showStatus && (
                                    <StatusSelector
                                        status={status}
                                        setStatus={setStatus}
                                        className={classes.small}
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
                                    className={classes.small}
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
                </div>
            </form>
        </Root>
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
