import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useGetOne } from 'react-admin';
import type { Activity, Company, Sale } from '../types';
import { ActivityDate } from './ActivityDate';

export function ActivityCompanyCreated({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: accountManager,
        error,
        isPending,
    } = useGetOne<Sale>('sales', { id: company.sales_id });

    if (isPending) {
        return <Skeleton />;
    }

    if (error) {
        return null;
    }

    return (
        <ListItem>
            <Typography>
                {accountManager.first_name} {accountManager.last_name} added{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>{' '}
                in companies
            </Typography>
            <ActivityDate date={activity.date} />
        </ListItem>
    );
}
