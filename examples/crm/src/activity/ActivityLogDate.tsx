import Typography from '@mui/material/Typography';

export function ActivityLogDate({ date }: { date: string }) {
    const now = new Date();
    const d = new Date(date);

    if (
        d.getDay() === now.getDay() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    ) {
        return (
            <Typography color="textSecondary" variant="body2">
                {new Intl.DateTimeFormat('en-US', {
                    timeStyle: 'short',
                }).format(d)}
            </Typography>
        );
    }

    return (
        <Typography color="textSecondary" variant="body2">
            {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'short',
            }).format(d)}
        </Typography>
    );
}
