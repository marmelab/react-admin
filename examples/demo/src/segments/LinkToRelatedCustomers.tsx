import * as React from 'react';
import { FC } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';
import { stringify } from 'query-string';

import visitors from '../visitors';

const useStyles = makeStyles({
    icon: { paddingRight: '0.5em' },
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
});

const LinkToRelatedCustomers: FC<{ segment: string }> = ({ segment }) => {
    const translate = useTranslate();
    const classes = useStyles();
    return (
        <Button
            size="small"
            color="primary"
            component={Link}
            to={{
                pathname: '/customers',
                search: stringify({
                    filter: JSON.stringify({ groups: segment }),
                }),
            }}
            className={classes.link}
        >
            <visitors.icon className={classes.icon} />
            {translate('resources.segments.fields.customers')}
        </Button>
    );
};

export default LinkToRelatedCustomers;
