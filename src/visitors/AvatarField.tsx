import * as React from 'react';
import { Avatar, SxProps } from '@mui/material';
import { FieldProps, useRecordContext } from 'react-admin';
import { Customer } from '../types';

interface Props extends Omit<FieldProps<Customer>, 'source'> {
    sx?: SxProps;
    size?: string;
}

const AvatarField = ({ size = '25', sx }: Props) => {
    const record = useRecordContext<Customer>();
    if (!record) return null;
    return (
        <Avatar
            src={`${record.avatar}?size=${size}x${size}`}
            style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
            sx={sx}
            alt={`${record.first_name} ${record.last_name}`}
        />
    );
};

export default AvatarField;
