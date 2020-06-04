import * as React from 'react';
import { FC } from 'react';
import { ReferenceField, TextField } from 'react-admin';
import { ReferenceFieldProps } from './../types';

const ProductReferenceField: FC<
    Omit<ReferenceFieldProps, 'reference' | 'children'>
> = props => (
    <ReferenceField
        label="Product"
        source="product_id"
        reference="products"
        {...props}
    >
        <TextField source="reference" />
    </ReferenceField>
);

ProductReferenceField.defaultProps = {
    source: 'product_id',
    addLabel: true,
};

export default ProductReferenceField;
