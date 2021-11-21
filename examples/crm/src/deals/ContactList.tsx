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
    const { ids, data, loaded } = useListContext();

    if (!loaded) return <div style={{ height: '2em' }} />;
    return (
        <Root className={classes.ul}>
            {ids.map(id => (
                <li key={id} className={classes.li}>
                    <Link
                        component={RouterLink}
                        to={`/contacts/${id}`}
                        variant="subtitle1"
                    >
                        {data[id].first_name} {data[id].last_name}
                    </Link>
                </li>
            ))}
        </Root>
    );
};
