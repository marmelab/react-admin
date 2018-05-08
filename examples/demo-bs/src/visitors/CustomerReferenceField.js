import React from 'react';
import { ReferenceField } from '@yeutech/react-admin-bs';

import FullNameField from './FullNameField';

const CustomerReferenceField = props => (
    <ReferenceField source="customer_id" reference="customers" {...props}>
        <FullNameField />
    </ReferenceField>
);
CustomerReferenceField.defaultProps = {
    source: 'customer_id',
    addLabel: true,
};

export default CustomerReferenceField;
