import * as React from 'react';
import { FunctionField, FieldProps } from 'react-admin';
import { Order } from '../types';

const NbItemsField = (_: FieldProps) => (
    <FunctionField<Order> render={record => record.basket.length} />
);

export default NbItemsField;
