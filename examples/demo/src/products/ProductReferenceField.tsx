import React, { FC } from 'react';
import { ReferenceField, TextField } from 'react-admin';
import { FieldProps } from './../types';

const ProductReferenceField: FC<FieldProps> = props => (
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
