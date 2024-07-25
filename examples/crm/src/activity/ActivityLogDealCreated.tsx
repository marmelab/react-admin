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
                        component="div"
                        sx={{
                            flexGrow: 1,
                        }}
                        variant="body2"
                    >
                        <Typography
                            component={Link}
                            to={`/deals/${deal.id}/show`}
                            variant="body2"
                        >
                            {deal.name}
                        </Typography>{' '}
                        deal was added to{' '}
                        <Typography
                            component="strong"
                            fontWeight={700}
                            variant="body2"
                        >
                            {company.name}
                        </Typography>{' '}
                        by {sale.first_name} {sale.last_name}
                    </Typography>

                    <ActivityLogDate date={deal.created_at} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
