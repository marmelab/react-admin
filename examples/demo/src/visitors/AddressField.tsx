import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { Customer } from '../types';

const AddressField = () => {
    const record = useRecordContext<Customer>();

    return record ? (
        <span>
            {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
        </span>
    ) : null;
};

export default AddressField;
