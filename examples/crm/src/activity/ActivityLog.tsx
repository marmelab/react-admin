import { Alert, Divider, Skeleton, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Identifier, useDataProvider } from 'react-admin';

import { CrmDataProvider } from '../providers/types';
import { ActivityLogContext } from './ActivityLogContext';
import { ActivityLogIterator } from './ActivityLogIterator';

type ActivityLogProps = {
    companyId?: Identifier;
    pageSize?: number;
    context?: 'company' | 'contact' | 'deal' | 'all';
};

export function ActivityLog({
    companyId,
    pageSize = 20,
    context = 'all',
}: ActivityLogProps) {
    const dataProvider = useDataProvider<CrmDataProvider>();
    const { data, isPending, error } = useQuery({
        queryKey: ['activityLog', companyId],
        queryFn: () => dataProvider.getActivityLog(companyId),
    });

    if (isPending) {
        return (
            <Stack mt={0.5}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Stack spacing={2} sx={{ mt: 1 }} key={index}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ alignItems: 'center' }}
                        >
                            <Skeleton
                                variant="circular"
                                width={20}
                                height={20}
                            />
                            <Skeleton width="100%" />
                        </Stack>
                        <Skeleton variant="rectangular" height={50} />
                        <Divider />
                    </Stack>
                ))}
            </Stack>
        );
    }

    if (error) {
        return <Alert severity="error">Failed to load activity log</Alert>;
    }

    return (
        <ActivityLogContext.Provider value={context}>
            <ActivityLogIterator activities={data} pageSize={pageSize} />
        </ActivityLogContext.Provider>
    );
}
