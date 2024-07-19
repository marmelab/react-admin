import * as React from 'react';
import { Stack } from '@mui/material';
import { useListContext } from 'react-admin';

import { Note } from './Note';
import { NoteCreate } from './NoteCreate';

export const NotesIterator = ({
    showStatus,
    reference,
}: {
    showStatus?: boolean;
    reference: 'contacts' | 'deals';
}) => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return null;
    return (
        <>
            <NoteCreate showStatus={showStatus} reference={reference} />
            <Stack mt={4} gap={3}>
                {data.map((note, index) => (
                    <Note
                        note={note}
                        isLast={index === data.length - 1}
                        showStatus={showStatus}
                        key={index}
                    />
                ))}
            </Stack>
        </>
    );
};
