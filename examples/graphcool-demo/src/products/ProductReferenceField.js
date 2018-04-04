import React from 'react';
import { ReferenceField, TextField } from 'react-admin';

const ProductReferenceField = props => (
    <ReferenceField source="product.id" reference="Product" {...props}>
        <TextField source="reference" />
    </ReferenceField>
);
ProductReferenceField.defaultProps = {
    source: 'product.id',
    addLabel: true,
};

export default ProductReferenceField;
