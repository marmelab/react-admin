import Typography from '@mui/material/Typography';

export function ActivityDate({ date }: { date: string }) {
    const now = new Date();
    const d = new Date(date);

    if (
        d.getDay() === now.getDay() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    ) {
        return (
            <Typography
                color="textSecondary"
                sx={{
                    minWidth: '96px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {new Intl.DateTimeFormat('en-US', {
                    timeStyle: 'short',
                }).format(d)}
            </Typography>
        );
    }

    return (
        <Typography
            color="textSecondary"
            sx={{
                minWidth: '96px',
                display: 'flex',
                justifyContent: 'flex-end',
            }}
        >
            {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'short',
            }).format(d)}
        </Typography>
    );
}
