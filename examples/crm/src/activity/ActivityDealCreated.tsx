import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { Link, useGetOne } from 'react-admin';
import type { Activity, Company, Deal, Sale } from '../types';
import { ActivityDate } from './ActivityDate';

export function ActivityDealCreated({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: deal,
        error: dealError,
        isPending: dealIsPending,
    } = useGetOne<Deal>('deals', { id: activity.deal_id });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: deal?.sales_id });

    if (dealIsPending || saleIsPending) {
        return <Skeleton />;
    }

    if (dealError || saleError) {
        return null;
    }

    return (
        <ListItem>
            <Box>
                {accountManager.first_name} {accountManager.last_name} created{' '}
                the "<Link to={`/deals/${deal.id}/show`}>{deal.name}</Link>"
                deal to{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>
            </Box>
            <ActivityDate date={activity.date} />
        </ListItem>
    );
}
