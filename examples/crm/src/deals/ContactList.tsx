import { Link, Stack, Typography } from '@mui/material';
import { useListContext } from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar } from '../contacts/Avatar';

export const ContactList = () => {
    const { data, error, isPending } = useListContext();
    if (isPending || error) return <div style={{ height: '2em' }} />;
    return (
        <Stack direction="row" flexWrap="wrap" gap={3} mt={1}>
            {data.map(contact => (
                <Stack direction="row" key={contact.id} gap={1}>
                    <Avatar record={contact} />
                    <Stack>
                        <Link
                            component={RouterLink}
                            to={`/contacts/${contact.id}/show`}
                            variant="body2"
                        >
                            {contact.first_name} {contact.last_name}
                        </Link>
                        <Typography variant="caption" color="text.secondary">
                            {contact.title}
                            {contact.title && contact.company_name && ' at '}
                            {contact.company_name}
                        </Typography>
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
};
