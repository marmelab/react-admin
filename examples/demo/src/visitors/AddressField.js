import React from 'react';

const AddressField = ({ record }) => (
    <span>
        {record.address}, {record.city} {record.zipcode}
    </span>
);

export default AddressField;
