import { Grid } from '@mui/material';
import { DashboardActivityLog } from './DashboardActivityLog';
import { DealsChart } from './DealsChart';
import { HotContacts } from './HotContacts';
import { TasksList } from './TasksList';
import { Welcome } from './Welcome';

export const Dashboard = () => (
    <Grid container spacing={2} mt={1}>
        <Grid container item xs={12} md={9} spacing={2}>
            <Grid item xs={12} md={4}>
                <Welcome />
            </Grid>
            <Grid item xs={12} md={8}>
                <DealsChart />
            </Grid>
            <Grid item xs={12} md={4}>
                <HotContacts />
            </Grid>
            <Grid item xs={12} md={8}>
                <DashboardActivityLog />
            </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
            <TasksList />
        </Grid>
    </Grid>
);
