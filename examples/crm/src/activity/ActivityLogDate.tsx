import Typography from '@mui/material/Typography';
import { formatRelative } from 'date-fns';

export function ActivityLogDate({ date }: { date: string }) {
    return (
        <Typography color="textSecondary" variant="body2" title={date}>
            {formatRelative(new Date(date), new Date())}
        </Typography>
    );
}
