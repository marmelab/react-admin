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
    activity: { sale, contact, contactNote, company },
}: ActivityLogContactNoteCreatedProps) {
    return (
        <RecordContextProvider value={contact}>
            <ActivityLogNote
                header={
                    <>
                        <Avatar />
                        <Typography
                            component="p"
                            sx={{
                                flexGrow: 1,
                            }}
                            variant="body2"
                        >
                            A note has been added to{' '}
                            <Link
                                to={`/contacts/${contact.id}/show`}
                                variant="body2"
                            >
                                {contact.first_name} {contact.last_name}
                            </Link>{' '}
                            from <strong>{company.name}</strong> by{' '}
                            {sale.first_name} {sale.last_name}
                        </Typography>

                        <ActivityLogDate date={contactNote.date} />
                    </>
                }
                text={contactNote.text}
            />
        </RecordContextProvider>
    );
}
