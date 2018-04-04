import React from 'react';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { Link, translate } from 'react-admin';
import { stringify } from 'query-string';

import { ProductIcon } from '../products';

const styles = {
    icon: { paddingRight: '0.5em' },
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const LinkToRelatedProducts = ({ classes, record, translate }) => (
    <Button
        color="primary"
        component={Link}
        to={{
            pathname: '/Product',
            search: stringify({
                page: 1,
                perPage: 25,
                filter: JSON.stringify({ 'category.id': record.id }),
            }),
        }}
        className={classes.link}
    >
        <ProductIcon className={classes.icon} />
        {translate('resources.Category.fields.products')}
    </Button>
);

const enhance = compose(withStyles(styles), translate);
export default enhance(LinkToRelatedProducts);
