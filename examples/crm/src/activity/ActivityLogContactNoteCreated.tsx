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
                        <Avatar width={20} height={20} />
                        <Typography
                            component="p"
                            sx={{
                                flexGrow: 1,
                            }}
                            variant="body2"
                            color="text.secondary"
                        >
                            {sale.first_name} {sale.last_name} added note about{' '}
                            <Link
                                to={`/contacts/${contact.id}/show`}
                                variant="body2"
                            >
                                {contact.first_name} {contact.last_name}
                            </Link>{' '}
                            from{' '}
                            <Link
                                component={Link}
                                to={`/companies/${company.id}/show`}
                                variant="body2"
                            >
                                {company.name}
                            </Link>
                        </Typography>

                        <ActivityLogDate date={contactNote.date} />
                    </>
                }
                text={contactNote.text}
            />
        </RecordContextProvider>
    );
}
