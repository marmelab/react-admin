import { ListItem, Stack, Typography } from '@mui/material';
import { Link, RecordContextProvider } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealCreated } from '../types';
import { ActivityLogSale } from './ActivityLogSale';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogDealCreatedProps = {
    activity: ActivityDealCreated;
    context: 'company' | 'contact' | 'deal' | 'all';
};

export function ActivityLogDealCreated({
    activity: { sale, deal, company },
    context,
}: ActivityLogDealCreatedProps) {
    return (
        <RecordContextProvider value={company}>
            <ListItem disableGutters>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <CompanyAvatar width={20} height={20} />
                    <Typography
                        component="p"
                        sx={{
                            flexGrow: 1,
                        }}
                        variant="body2"
                        color="text.secondary"
                    >
                        <ActivityLogSale sale={sale} /> added deal{' '}
                        <Link to={`/deals/${deal.id}/show`} variant="body2">
                            {deal.name}
                        </Link>{' '}
                        {context !== 'company' && (
                            <>
                                to company{' '}
                                <Link
                                    to={`/companies/${company.id}/show`}
                                    variant="body2"
                                >
                                    {company.name}
                                </Link>
                            </>
                        )}
                    </Typography>
                    <ActivityLogDate date={deal.created_at} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
