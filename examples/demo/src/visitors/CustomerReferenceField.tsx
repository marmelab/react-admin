import * as React from 'react';
import { FC } from 'react';
import { ReferenceField } from 'react-admin';

import FullNameField from './FullNameField';
import { ReferenceFieldProps } from '../types';

const CustomerReferenceField: FC<
    Omit<ReferenceFieldProps, 'reference' | 'children'>
> = props => (
    <ReferenceField source="customer_id" reference="customers" {...props}>
        <FullNameField />
    </ReferenceField>
);

CustomerReferenceField.defaultProps = {
    source: 'customer_id',
    addLabel: true,
};

export default CustomerReferenceField;
