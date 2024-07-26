import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';
import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogDealCreatedProps = {
    activity: ActivityDealCreated;
};

export function ActivityLogDealCreated({
    activity: { sale, deal, company },
}: ActivityLogDealCreatedProps) {
    return (
        <RecordContextProvider value={company}>
            <ListItem>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <CompanyAvatar />
                    <Typography
                        component="p"
                        sx={{
                            flexGrow: 1,
                        }}
                        variant="body2"
                    >
                        <Link to={`/deals/${deal.id}/show`} variant="body2">
                            {deal.name}
                        </Link>{' '}
                        has been added to <strong>{company.name}</strong> by{' '}
                        {sale.first_name} {sale.last_name}
                    </Typography>

                    <ActivityLogDate date={deal.created_at} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
