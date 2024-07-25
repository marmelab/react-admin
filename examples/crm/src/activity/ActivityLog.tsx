import { Alert, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Identifier, useDataProvider } from 'react-admin';
import { CustomDataProvider } from '../dataProvider';
import { ActivityLogIterator } from './ActivityLogIterator';

type ActivityLogProps = {
    companyId?: Identifier;
    pageSize?: number;
};

export function ActivityLog({ companyId, pageSize = 20 }: ActivityLogProps) {
    const dataProvider = useDataProvider<CustomDataProvider>();
    const { data, isPending, error } = useQuery({
        queryKey: ['activityLog', companyId],
        queryFn: () => dataProvider.getActivityLog(companyId),
    });

    if (isPending) {
        return <Skeleton />;
    }

    if (error) {
        return <Alert severity="error">Failed to load acticity log</Alert>;
    }

    return <ActivityLogIterator activities={data} pageSize={pageSize} />;
}
