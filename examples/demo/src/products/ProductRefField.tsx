import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FieldProps, Product } from '../types';

const ProductRefField: FC<FieldProps<Product>> = ({ record }) =>
    record ? (
        <Link to={`products/${record.id}`}>{record.reference}</Link>
    ) : null;

ProductRefField.defaultProps = {
    source: 'id',
    label: 'Reference',
};

export default ProductRefField;
