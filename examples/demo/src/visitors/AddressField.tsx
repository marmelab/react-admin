import * as React from 'react';
import { FC } from 'react';
import { FieldProps } from 'react-admin';
import { Customer } from '../types';

const AddressField: FC<FieldProps<Customer>> = ({ record }) =>
    record ? (
        <span>
            {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
        </span>
    ) : null;

export default AddressField;
