import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';
import { Avatar } from '../contacts/Avatar';
import type { ActivityContactCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogContactCreatedProps = {
    activity: ActivityContactCreated;
};

export function ActivityLogContactCreated({
    activity: { sale, contact, company },
}: ActivityLogContactCreatedProps) {
    return (
        <RecordContextProvider value={contact}>
            <ListItem>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Avatar />
                    <Typography
                        component="p"
                        sx={{
                            flexGrow: 1,
                        }}
                        variant="body2"
                    >
                        <Link
                            component={Link}
                            to={`/contacts/${contact.id}/show`}
                            variant="body2"
                        >
                            {contact.first_name} {contact.last_name}
                        </Link>{' '}
                        contact was added to <strong>{company.name}</strong> by{' '}
                        {sale.first_name} {sale.last_name}
                    </Typography>

                    <ActivityLogDate date={contact.first_seen} />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
