import * as React from 'react';
import { useListContext } from 'react-admin';
import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const ContactList = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) return <div style={{ height: '2em' }} />;
    return (
        <Box
            component="ul"
            sx={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'inline-block',
            }}
        >
            {data.map(contact => (
                <Box
                    component="li"
                    key={contact.id}
                    sx={{
                        display: 'inline',
                        '&:after': {
                            content: '", "',
                        },
                        '&:last-child:after': {
                            content: '""',
                        },
                    }}
                >
                    <Link
                        component={RouterLink}
                        to={`/contacts/${contact.id}`}
                        variant="subtitle1"
                    >
                        {contact.first_name} {contact.last_name}
                    </Link>
                </Box>
            ))}
        </Box>
    );
};
