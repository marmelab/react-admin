import * as React from 'react';
import { FieldProps } from 'react-admin';
import { Customer } from '../types';

const AddressField = ({ record }: FieldProps<Customer>) =>
    record ? (
        <span>
            {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
        </span>
    ) : null;

export default AddressField;
