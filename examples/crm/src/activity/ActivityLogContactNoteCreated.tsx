import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';
import { Avatar } from '../contacts/Avatar';
import type { ActivityContactNoteCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';
import { ActivityLogNote } from './ActivityLogNote';

type ActivityLogContactNoteCreatedProps = {
    activity: ActivityContactNoteCreated;
};

export function ActivityLogContactNoteCreated({
    activity: { sale, contact, contactNote },
}: ActivityLogContactNoteCreatedProps) {
    return (
        <RecordContextProvider value={contact}>
            <ActivityLogNote
                header={
                    <>
                        <Avatar />
                        <Typography
                            component="div"
                            sx={{
                                flexGrow: 1,
                            }}
                            variant="body2"
                        >
                            A note was added to{' '}
                            <Typography
                                component={Link}
                                to={`/contacts/${contact.id}/show`}
                                variant="body2"
                            >
                                {contact.first_name} {contact.last_name}
                            </Typography>{' '}
                            contact by {sale.first_name} {sale.last_name}
                        </Typography>

                        <ActivityLogDate date={contactNote.date} />
                    </>
                }
                text={contactNote.text}
            />
        </RecordContextProvider>
    );
}
