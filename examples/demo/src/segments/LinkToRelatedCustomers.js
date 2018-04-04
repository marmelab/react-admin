import React from 'react';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-admin';
import { translate } from 'react-admin';
import { stringify } from 'query-string';

import { VisitorIcon } from '../visitors';

const styles = {
    icon: { paddingRight: '0.5em' },
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const LinkToRelatedCustomers = ({ classes, segment, translate }) => (
    <Button
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
        <VisitorIcon className={classes.icon} />
        {translate('resources.segments.fields.customers')}
    </Button>
);

const enhance = compose(withStyles(styles), translate);
export default enhance(LinkToRelatedCustomers);
