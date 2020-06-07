import * as React from 'react';
import { FC } from 'react';
import { FieldProps, Customer } from '../types';

const AddressField: FC<FieldProps<Customer>> = ({ record }) =>
    record ? (
        <span>
            {record.address}, {record.city} {record.zipcode}
        </span>
    ) : null;

export default AddressField;
