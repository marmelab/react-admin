import * as React from 'react';
import { FC } from 'react';
import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';

interface Props {
    source?: string;
}

const ProductReferenceField: FC<
    Props & Omit<Omit<ReferenceFieldProps, 'source'>, 'reference' | 'children'>
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
