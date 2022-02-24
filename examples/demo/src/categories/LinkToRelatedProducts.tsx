import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTranslate, useRecordContext } from 'react-admin';
import { stringify } from 'query-string';

import products from '../products';
import { Category } from '../types';

const LinkToRelatedProducts = () => {
    const record = useRecordContext<Category>();
    const translate = useTranslate();

    return record ? (
        <Button
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
            sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
            <products.icon sx={{ paddingRight: '0.5em' }} />
            {translate('resources.categories.fields.products')}
        </Button>
    ) : null;
};

export default LinkToRelatedProducts;
