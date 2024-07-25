import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { ActivityLog } from '../activity/ActivityLog';

export function DashboardActivityLog() {
    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <AccessTimeIcon color="disabled" fontSize="large" />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    Upcoming tasks
                </Typography>
            </Box>
            <Card sx={{ mb: 2 }}>
                <ActivityLog />
            </Card>
        </>
    );
}
