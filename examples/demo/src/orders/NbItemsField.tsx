import * as React from 'react';
import { FC } from 'react';
import { FunctionField, Record } from 'react-admin';
import { Order } from '../types';

const render = (record?: Record) => record && (record as Order).basket.length;

const NbItemsField: FC<any> = ({ record }) => (
    <FunctionField record={record} render={render} />
);

NbItemsField.defaultProps = {
    label: 'resources.commands.fields.nb_items',
    textAlign: 'right',
};

export default NbItemsField;
