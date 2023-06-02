import * as React from 'react';
import { FunctionField, RenderRecordFunction } from 'react-admin';
import { Order } from '../types';

const render: RenderRecordFunction<Order> = record => record.basket.length;

const NbItemsField = () => <FunctionField<Order> render={render} />;

NbItemsField.defaultProps = {
    label: 'resources.commands.fields.nb_items',
    textAlign: 'right',
};

export default NbItemsField;
