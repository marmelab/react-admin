import React, { FC } from 'react';
import { ReferenceField } from 'react-admin';

import FullNameField from './FullNameField';
import { FieldProps } from '../types';

const CustomerReferenceField: FC<FieldProps> = props => (
    <ReferenceField source="customer_id" reference="customers" {...props}>
        <FullNameField />
    </ReferenceField>
);

CustomerReferenceField.defaultProps = {
    source: 'customer_id',
    addLabel: true,
};

export default CustomerReferenceField;
