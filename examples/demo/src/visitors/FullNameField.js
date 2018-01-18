import React from 'react';
import AvatarField from './AvatarField';
import pure from 'recompose/pure';

const FullNameField = ({ record = {}, size = 25 }) => (
    <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
        <AvatarField record={record} size={size} />
        {record.first_name} {record.last_name}
    </div>
);

const PureFullNameField = pure(FullNameField);

PureFullNameField.defaultProps = {
    source: 'last_name',
    label: 'resources.customers.fields.name',
};

export default PureFullNameField;
