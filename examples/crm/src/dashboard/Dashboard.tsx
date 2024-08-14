import { Grid, Stack } from '@mui/material';
import { DashboardActivityLog } from './DashboardActivityLog';
import { DealsChart } from './DealsChart';
import { HotContacts } from './HotContacts';
import { TasksList } from './TasksList';
import { Welcome } from './Welcome';
import { useGetList } from 'react-admin';
import { Contact, ContactNote } from '../types';
import { DashboardStepper } from './DashboardStepper';

export const Dashboard = () => {
    const {
        data: dataContact,
        total: totalContact,
        isPending: isPendingContact,
    } = useGetList<Contact>('contacts', {
        pagination: { page: 1, perPage: 1 },
    });

    const { total: totalContactNotes, isPending: isPendingContactNotes } =
        useGetList<ContactNote>('contactNotes', {
            pagination: { page: 1, perPage: 1 },
        });

    const { total: totalDeal, isPending: isPendingDeal } = useGetList<Contact>(
        'deals',
        {
            pagination: { page: 1, perPage: 1 },
        }
    );

    const isPending =
        isPendingContact || isPendingContactNotes || isPendingDeal;

    if (isPending) {
        return null;
    }

    if (!totalContact) {
        return <DashboardStepper step={1} />;
    }

    if (!totalContactNotes) {
        return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
    }

    return (
        <Grid container spacing={2} mt={1} rowGap={4}>
            <Grid item xs={12} md={3}>
                <Stack gap={4}>
                    {import.meta.env.VITE_IS_DEMO === 'true' ? (
                        <Welcome />
                    ) : null}
                    <HotContacts />
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack gap={4}>
                    {totalDeal ? <DealsChart /> : null}
                    <DashboardActivityLog />
                </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
                <TasksList />
            </Grid>
        </Grid>
    );
};
