import * as React from 'react';
import { Grid } from '@mui/material';

import { Welcome } from './Welcome';
import { DealsChart } from './DealsChart';
import { HotContacts } from './HotContacts';
import { LatestNotes } from './LatestNotes';
import { DealsPipeline } from './DealsPipeline';

export const Dashboard = () => (
    <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={9}>
            <DealsChart />
        </Grid>
        <Grid item xs={12} md={3}>
            <Welcome />
        </Grid>
        <Grid item xs={12} md={6}>
            <LatestNotes />
        </Grid>
        <Grid item xs={12} md={3}>
            <HotContacts />
        </Grid>
        <Grid item xs={12} md={3}>
            <DealsPipeline />
        </Grid>
    </Grid>
);
