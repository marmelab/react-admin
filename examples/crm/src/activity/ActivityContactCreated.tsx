import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link, useGetOne } from 'react-admin';
import type { Activity, Company, Contact, Sale } from '../types';
import { ActivityDate } from './ActivityDate';

export function ActivityContactCreated({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: contact,
        error: contactError,
        isPending: contactIsPending,
    } = useGetOne<Contact>('contacts', { id: activity.contact_id });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: contact?.sales_id });

    if (contactIsPending || saleIsPending) {
        return <Skeleton />;
    }

    if (contactError || saleError) {
        return null;
    }

    return (
        <ListItem>
            <Box>
                {accountManager.first_name} {accountManager.last_name} added{' '}
                <Link to={`/contacts/${contact.id}/show`}>
                    {contact.first_name} {contact.last_name}
                </Link>{' '}
                to{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>
            </Box>
            <ActivityDate date={activity.date} />
        </ListItem>
    );
}
