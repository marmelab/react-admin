import { Grid, Stack } from '@mui/material';
import { DashboardActivityLog } from './DashboardActivityLog';
import { DealsChart } from './DealsChart';
import { HotContacts } from './HotContacts';
import { TasksList } from './TasksList';
import { Welcome } from './Welcome';

export const Dashboard = () => (
    <Grid container spacing={2} mt={1} rowGap={4}>
        <Grid item xs={12} md={3}>
            <Stack gap={4}>
                <Welcome />
                <HotContacts />
            </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
            <Stack gap={4}>
                <DealsChart />
                <DashboardActivityLog />
            </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
            <TasksList />
        </Grid>
    </Grid>
);
