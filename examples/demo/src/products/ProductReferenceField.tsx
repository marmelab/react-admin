import * as React from 'react';
import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';

interface Props {
    source?: string;
}

const ProductReferenceField = (
    props: Props &
        Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>
) => (
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
};

export default ProductReferenceField;
