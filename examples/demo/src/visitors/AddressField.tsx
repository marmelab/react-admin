import React, { FC } from 'react';
import { FieldProps } from '../types';

const AddressField: FC<FieldProps> = ({ record }) =>
    record ? (
        <span>
            {record.address}, {record.city} {record.zipcode}
        </span>
    ) : null;

export default AddressField;
