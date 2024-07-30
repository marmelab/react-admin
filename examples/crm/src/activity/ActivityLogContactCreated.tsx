import { ListItem, Stack, Typography } from '@mui/material';
import { Link, RecordContextProvider, DateField } from 'react-admin';
import { Avatar } from '../contacts/Avatar';
import type { ActivityContactCreated } from '../types';

type ActivityLogContactCreatedProps = {
    activity: ActivityContactCreated;
    context: 'company' | 'contact' | 'deal' | 'all';
};

export function ActivityLogContactCreated({
    activity: { sale, contact, company },
    context,
}: ActivityLogContactCreatedProps) {
    return (
        <RecordContextProvider value={contact}>
            <ListItem disableGutters>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Avatar width={20} height={20} />
                    <Typography
                        component="p"
                        sx={{
                            flexGrow: 1,
                        }}
                        variant="body2"
                        color="text.secondary"
                    >
                        {sale.first_name} {sale.last_name} added{' '}
                        <Link
                            component={Link}
                            to={`/contacts/${contact.id}/show`}
                            variant="body2"
                        >
                            {contact.first_name} {contact.last_name}
                        </Link>{' '}
                        {context !== 'company' && (
                            <>
                                to{' '}
                                <Link
                                    component={Link}
                                    to={`/companies/${contact.company_id}/show`}
                                    variant="body2"
                                >
                                    {company.name}
                                </Link>
                            </>
                        )}
                    </Typography>

                    <DateField
                        source="first_seen"
                        showTime
                        color="text.secondary"
                        options={{
                            dateStyle: 'full',
                            timeStyle: 'short',
                        }}
                    />
                </Stack>
            </ListItem>
        </RecordContextProvider>
    );
}
