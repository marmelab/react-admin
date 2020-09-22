import * as React from 'react';
import { FC } from 'react';
import { FunctionField, Record } from 'react-admin';
import { Order } from '../types';

const render = (record?: Record) => (record as Order).basket.length;

const NbItemsField: FC = () => <FunctionField render={render} />;

NbItemsField.defaultProps = {
    label: 'Nb Items',
    textAlign: 'right',
};

export default NbItemsField;
