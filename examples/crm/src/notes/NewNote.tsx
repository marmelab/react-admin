import * as React from 'react';
import { useState, FormEvent } from 'react';
import {
    useRecordContext,
    useCreate,
    useUpdate,
    useRefresh,
    useNotify,
    useGetIdentity,
    Identifier,
    useResourceContext,
} from 'react-admin';
import { TextField as TextInput, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { StatusSelector } from './StatusSelector';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(1),
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(1),
    },
    small: {
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
    const classes = useStyles();
    const record = useRecordContext();
    const resource = useResourceContext();
    const [text, setText] = useState('');
    const [status, setStatus] = useState(record && record.status);
    const [date, setDate] = useState(getCurrentDate());
    const [create, { loading }] = useCreate();
    const [update] = useUpdate();
    // FIXME: use refetch instead when ReferenceManyField exposes it in the ListContext
    const refresh = useRefresh();
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
        update(
            reference,
            ((record && record.id) as unknown) as Identifier,
            {
                last_seen: date,
                status,
                nb_notes: record.nb_notes + 1,
            },
            record
        );
        create(resource, data, {
            onSuccess: () => {
                setText('');
                notify('Note added successfully');
                refresh();
            },
        });
        return false;
    };
    return (
        <div className={classes.root}>
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
                        disabled={!text || loading}
                    >
                        Add this note
                    </Button>
                </div>
            </form>
        </div>
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
