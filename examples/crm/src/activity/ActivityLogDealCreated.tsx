import { ListItem, Stack, Typography } from '@mui/material';
import { Link, RecordContextProvider, DateField } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealCreated } from '../types';

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
                        {sale.first_name} {sale.last_name} added deal{' '}
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

                    <RecordContextProvider value={deal}>
                        <DateField
                            source="created_at"
                            showTime
                            color="text.secondary"
                            options={{
                                dateStyle: 'full',
                                timeStyle: 'short',
                            }}
                        />
                    </RecordContextProvider>
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
