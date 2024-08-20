import * as React from 'react';
import { Box, Divider, Stack } from '@mui/material';
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
        <Box mt={2}>
            <NoteCreate showStatus={showStatus} reference={reference} />
            {data && (
                <Stack mt={2} gap={1}>
                    {data.map((note, index) => (
                        <React.Fragment key={index}>
                            <Note
                                note={note}
                                isLast={index === data.length - 1}
                                showStatus={showStatus}
                                key={index}
                            />
                            {index < data.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </Stack>
            )}
        </Box>
    );
};
