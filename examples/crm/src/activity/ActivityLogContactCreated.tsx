import { ListItem, Stack, Typography } from '@mui/material';
import { Link, ReferenceField } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityContactCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogContactCreatedProps = {
    activity: ActivityContactCreated;
};

export function ActivityLogContactCreated({
    activity,
}: ActivityLogContactCreatedProps) {
    const context = useActivityLogContext();
    const { contact } = activity;
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
                    <ReferenceField
                        source="sales_id"
                        reference="sales"
                        record={activity}
                        link={false}
                    >
                        <SaleName />
                    </ReferenceField>{' '}
                    added{' '}
                    <Link to={`/contacts/${contact.id}/show`}>
                        {contact.first_name} {contact.last_name}
                    </Link>{' '}
                    {context !== 'company' && (
                        <>
                            to{' '}
                            <ReferenceField
                                source="company_id"
                                reference="companies"
                                record={activity}
                                link="show"
                            />{' '}
                            <RelativeDate date={activity.date} />
                        </>
                    )}
                </Typography>
                {context === 'company' && (
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="span"
                    >
                        <RelativeDate date={activity.date} />
                    </Typography>
                )}
            </Stack>
        </ListItem>
    );
}
