import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link, useGetOne } from 'react-admin';
import type { Activity, Company, Contact, ContactNote, Sale } from '../types';
import { ActivityDate } from './ActivityDate';

export function ActivityContactNoteCreated({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: contactNote,
        error: contactNoteError,
        isPending: contactNoteIsPending,
    } = useGetOne<ContactNote>('contactNotes', {
        id: activity.contact_note_id,
    });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: contactNote?.sales_id });

    const {
        data: contact,
        error: contactError,
        isPending: contactIsPending,
    } = useGetOne<Contact>('contacts', { id: contactNote?.contact_id });

    const [seeMore, setSeeMore] = useState(false);

    if (contactNoteIsPending || saleIsPending || contactIsPending) {
        return <Skeleton />;
    }

    if (contactNoteError || saleError || contactError) {
        return null;
    }

    const maxDisplayLength = 450;

    const slicedNote =
        contactNote.text.length > maxDisplayLength
            ? contactNote.text.slice(0, maxDisplayLength)
            : null;

    return (
        <ListItem>
            <Stack gap={1}>
                <Box>
                    {accountManager.first_name} {accountManager.last_name} added{' '}
                    a note about{' '}
                    <Link to={`/contacts/${contact.id}/show`}>
                        {contact.first_name} {contact.last_name}
                    </Link>{' '}
                    of{' '}
                    <Typography component="strong" fontWeight={700}>
                        {company.name}
                    </Typography>
                </Box>
                <Box>
                    {slicedNote && !seeMore
                        ? `${slicedNote}...`
                        : contactNote.text}
                </Box>
                <Box>
                    {slicedNote ? (
                        seeMore ? (
                            <Button
                                size="small"
                                onClick={() => setSeeMore(false)}
                            >
                                See less
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                onClick={() => setSeeMore(true)}
                            >
                                See more
                            </Button>
                        )
                    ) : null}
                </Box>
            </Stack>
            <ActivityDate date={activity.date} />
        </ListItem>
    );
}
