import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';
import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityCompanyCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogCompanyCreatedProps = {
    activity: ActivityCompanyCreated;
};

export function ActivityLogCompanyCreated({
    activity: { sale, company },
}: ActivityLogCompanyCreatedProps) {
    return (
        <RecordContextProvider value={company}>
            <ListItem disableGutters>
                <Stack
                    direction="row"
                    spacing={2}
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
                        {sale.first_name} {sale.last_name} added company{' '}
                        <Link
                            component={Link}
                            to={`/companies/${company.id}/show`}
                            variant="body2"
                        >
                            {company.name}
                        </Link>
                    </Typography>

                    <ActivityLogDate date={company.created_at} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
