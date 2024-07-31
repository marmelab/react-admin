import { Typography } from '@mui/material';
import { Link } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityContactNoteCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { ActivityLogNote } from './ActivityLogNote';
import { ActivityLogDate } from './ActivityLogDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogContactNoteCreatedProps = {
    activity: ActivityContactNoteCreated;
};

export function ActivityLogContactNoteCreated({
    activity: { sale, contact, contactNote, company },
}: ActivityLogContactNoteCreatedProps) {
    const context = useActivityLogContext();
    return (
        <ActivityLogNote
            header={
                <>
                    <Avatar width={20} height={20} record={contact} />
                    <Typography
                        component="p"
                        variant="body2"
                        color="text.secondary"
                        flexGrow={1}
                    >
                        <SaleName sale={sale} /> added a note about{' '}
                        <Link to={`/contacts/${contact.id}/show`}>
                            {contact.first_name} {contact.last_name}
                        </Link>
                        {context !== 'company' && (
                            <>
                                {' from '}
                                <Link to={`/companies/${company.id}/show`}>
                                    {company.name}
                                </Link>{' '}
                                <ActivityLogDate date={contactNote.date} />
                            </>
                        )}
                    </Typography>
                    {context === 'company' && (
                        <ActivityLogDate date={contactNote.date} />
                    )}
                </>
            }
            text={contactNote.text}
        />
    );
}
