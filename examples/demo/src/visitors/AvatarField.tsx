import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { FieldProps } from 'react-admin';
import { Customer } from '../types';

interface Props extends FieldProps<Customer> {
    className?: string;
    size?: string;
}

const AvatarField = ({ record, size = '25', className }: Props) =>
    record ? (
        <Avatar
            src={`${record.avatar}?size=${size}x${size}`}
            style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
            className={className}
        />
    ) : null;

export default AvatarField;
