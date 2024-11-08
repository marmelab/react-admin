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
                <Link href="https://marmelab.com/atomic-crm">Atomic CRM</Link>{' '}
                is a template designed to help you quickly build your own CRM.
            </Typography>
            <Typography variant="body2" gutterBottom>
                This demo runs on a mock API, so you can explore and modify the
                data. It resets on reload. The full version uses Supabase for
                the backend.
            </Typography>
            <Typography variant="body2">
                Powered by{' '}
                <Link href="https://marmelab.com/react-admin">react-admin</Link>
                , Atomic CRM is fully open-source. You can find the code at{' '}
                <Link href="https://github.com/marmelab/atomic-crm">
                    marmelab/atomic-crm
                </Link>
                .
            </Typography>
        </CardContent>
    </Card>
);
