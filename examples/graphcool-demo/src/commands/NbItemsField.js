import React from 'react';
import { FunctionField } from '@yeutech/react-admin';

const render = record => record.basket.length;

const NbItemsField = props => <FunctionField {...props} render={render} />;

NbItemsField.defaultProps = {
    label: 'Nb Items',
    textAlign: 'right',
};

export default NbItemsField;
