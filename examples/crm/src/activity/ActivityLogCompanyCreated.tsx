import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RecordContextProvider } from 'react-admin';
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
                        <strong>{company.name}</strong> was added to companies
                        by {sale.first_name} {sale.last_name}
                    </Typography>

                    <ActivityLogDate date={company.created_at} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
