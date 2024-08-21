import { Card, CardContent, Link, Typography } from '@mui/material';

export const Welcome = () => (
    <Card
        sx={{
            background: `#c5dedd`,
            color: 'rgba(0, 0, 0, 0.87)',
        }}
    >
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Your CRM Starter Kit
            </Typography>
            <Typography variant="body2" gutterBottom>
                This demo is a template you can use to kickstart your own CRM.
            </Typography>
            <Typography variant="body2" gutterBottom>
                Feel free to explore and modify the data—it’s stored locally and
                resets on reload. While this demo uses a mock API, the full
                version uses Supabase for the backend.
            </Typography>
            <Typography variant="body2">
                Built with{' '}
                <Link href="https://marmelab.com/react-admin">react-admin</Link>
                , Atomic CRM is fully open-source. Checkout the code at{' '}
                <Link href="https://github.com/marmelab/atomic-crm">
                    marmelab/atomic-crm
                </Link>
                .
            </Typography>
        </CardContent>
    </Card>
);
