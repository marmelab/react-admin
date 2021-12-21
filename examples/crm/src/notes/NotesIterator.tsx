import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useListContext } from 'react-admin';

import { Note } from './Note';
import { NewNote } from './NewNote';

const PREFIX = 'NotesIterator';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('div')({
    [`&.${classes.root}`]: {
        marginTop: '0.5em',
    },
});

export const NotesIterator = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'contacts' | 'deals';
}) => {
    const { data, isLoading } = useListContext();
    if (isLoading) return null;
    return (
        <>
            <NewNote showStatus={showStatus} reference={reference} />
            <Root className={classes.root}>
                {data.map((note, index) => (
                    <Note
                        note={note}
                        isLast={index === data.length - 1}
                        showStatus={showStatus}
                        reference={reference}
                        key={index}
                    />
                ))}
            </Root>
        </>
    );
};
