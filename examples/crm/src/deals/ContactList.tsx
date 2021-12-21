import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useListContext } from 'react-admin';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PREFIX = 'ContactList';

const classes = {
    ul: `${PREFIX}-ul`,
    li: `${PREFIX}-li`,
};

const Root = styled('ul')({
    [`&.${classes.ul}`]: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'inline-block',
    },
    [`& .${classes.li}`]: {
        display: 'inline',
        '&:after': {
            content: '", "',
        },
        '&:last-child:after': {
            content: '""',
        },
    },
});

export const ContactList = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) return <div style={{ height: '2em' }} />;
    return (
        <Root className={classes.ul}>
            {data.map(contact => (
                <li key={contact.id} className={classes.li}>
                    <Link
                        component={RouterLink}
                        to={`/contacts/${contact.id}`}
                        variant="subtitle1"
                    >
                        {contact.first_name} {contact.last_name}
                    </Link>
                </li>
            ))}
        </Root>
    );
};
