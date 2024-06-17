import * as React from 'react';
import { ReferenceField, ReferenceFieldProps } from 'react-admin';

import FullNameField from './FullNameField';

const CustomerReferenceField = (
    props: Omit<ReferenceFieldProps, 'reference' | 'children' | 'source'> & {
        source?: string;
    }
) => (
    <ReferenceField source="customer_id" reference="customers" {...props}>
        <FullNameField source="last_name" />
    </ReferenceField>
);

export default CustomerReferenceField;
