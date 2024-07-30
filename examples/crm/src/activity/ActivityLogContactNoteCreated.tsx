import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityContactNoteCreated } from '../types';
import { ActivityLogNote } from './ActivityLogNote';
import { ActivityLogSale } from './ActivityLogSale';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogContactNoteCreatedProps = {
    activity: ActivityContactNoteCreated;
    context: 'company' | 'contact' | 'deal' | 'all';
};

export function ActivityLogContactNoteCreated({
    activity: { sale, contact, contactNote, company },
    context,
}: ActivityLogContactNoteCreatedProps) {
    return (
        <RecordContextProvider value={contact}>
            <ActivityLogNote
                header={
                    <>
                        <Avatar width={20} height={20} />
                        <Typography
                            component="p"
                            sx={{ flexGrow: 1 }}
                            variant="body2"
                            color="text.secondary"
                        >
                            <ActivityLogSale sale={sale} /> added a note about{' '}
                            <Link
                                to={`/contacts/${contact.id}/show`}
                                variant="body2"
                            >
                                {contact.first_name} {contact.last_name}
                            </Link>{' '}
                            {context !== 'company' && (
                                <>
                                    from{' '}
                                    <Link
                                        component={Link}
                                        to={`/companies/${company.id}/show`}
                                        variant="body2"
                                    >
                                        {company.name}
                                    </Link>
                                </>
                            )}
                        </Typography>
                        <ActivityLogDate date={contactNote.date} />
                    </>
                }
                text={contactNote.text}
            />
        </RecordContextProvider>
    );
}
