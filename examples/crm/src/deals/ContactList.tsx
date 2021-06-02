import * as React from 'react';
import { useListContext } from 'react-admin';
import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'inline-block',
    },
    li: {
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
    const classes = useStyles();
    if (!loaded) return <div style={{ height: '2em' }} />;
    return (
        <ul className={classes.ul}>
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
        </ul>
    );
};
