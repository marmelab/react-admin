import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';
import { stringify } from 'query-string';

import visitors from '../visitors';

const styles = {
    icon: { paddingRight: '0.5em' },
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const LinkToRelatedCustomers = ({ classes, segment }) => {
    const translate = useTranslate();
    return (
        <Button
            size="small"
            color="primary"
            component={Link}
            to={{
                pathname: '/customers',
                search: stringify({
                    page: 1,
                    perPage: 25,
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

export default withStyles(styles)(LinkToRelatedCustomers);
