import { Record } from 'ra-core';
import React from 'react';
import { FunctionField } from 'react-admin';
import { FieldProps } from '../types';

const render = (record: Record) => record.basket.length;

const NbItemsField = (props: FieldProps) => (
    <FunctionField {...props} render={render} />
);

NbItemsField.defaultProps = {
    label: 'Nb Items',
    textAlign: 'right',
};

export default NbItemsField;
