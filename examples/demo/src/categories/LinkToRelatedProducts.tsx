import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTranslate, useRecordContext } from 'react-admin';
import { stringify } from 'query-string';

import products from '../products';
import { Category } from '../types';

const PREFIX = 'LinkToRelatedProducts';

const classes = {
    icon: `${PREFIX}-icon`,
    link: `${PREFIX}-link`,
};

const StyledButton = styled(Button)({
    [`& .${classes.icon}`]: { paddingRight: '0.5em' },
    [`&.${classes.link}`]: {
        display: 'inline-flex',
        alignItems: 'center',
    },
});

const LinkToRelatedProducts = () => {
    const record = useRecordContext<Category>();
    const translate = useTranslate();

    return record ? (
        <StyledButton
            size="small"
            color="primary"
            // @ts-ignore
            component={Link}
            to={{
                pathname: '/products',
                search: stringify({
                    filter: JSON.stringify({ category_id: record.id }),
                }),
            }}
            className={classes.link}
        >
            <products.icon className={classes.icon} />
            {translate('resources.categories.fields.products')}
        </StyledButton>
    ) : null;
};

export default LinkToRelatedProducts;
