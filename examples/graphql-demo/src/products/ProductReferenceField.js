import React from 'react';
import { ReferenceField, TextField } from 'react-admin';

const ProductReferenceField = props => (
    <ReferenceField source="product_id" reference="Product" {...props}>
        <TextField source="reference" />
    </ReferenceField>
);
ProductReferenceField.defaultProps = {
    source: 'product_id',
    addLabel: true,
};

export default ProductReferenceField;
