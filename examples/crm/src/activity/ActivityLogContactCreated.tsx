import { ListItem, Stack, Typography } from '@mui/material';
import { Link } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityContactCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { ActivityLogDate } from './ActivityLogDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogContactCreatedProps = {
    activity: ActivityContactCreated;
};

export function ActivityLogContactCreated({
    activity: { sale, contact, company },
}: ActivityLogContactCreatedProps) {
    const context = useActivityLogContext();
    return (
        <ListItem disableGutters>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <Avatar width={20} height={20} record={contact} />
                <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    flexGrow={1}
                >
                    <SaleName sale={sale} /> added{' '}
                    <Link to={`/contacts/${contact.id}/show`}>
                        {contact.first_name} {contact.last_name}
                    </Link>{' '}
                    {context !== 'company' && (
                        <>
                            to{' '}
                            <Link to={`/companies/${contact.company_id}/show`}>
                                {company.name}
                            </Link>{' '}
                            <ActivityLogDate date={contact.first_seen} />
                        </>
                    )}
                </Typography>
                {context === 'company' && (
                    <ActivityLogDate date={contact.first_seen} />
                )}
            </Stack>
        </ListItem>
    );
}
