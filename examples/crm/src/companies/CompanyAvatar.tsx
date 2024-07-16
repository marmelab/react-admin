import * as React from 'react';
import { Avatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

import { Company } from '../types';

export const CompanyAvatar = (props: {
    record?: Company;
    size?: 'small' | 'large';
}) => {
    const { size = 'large' } = props;
    const record = useRecordContext<Company>(props);
    if (!record) return null;
    return (
        <Avatar
            src={record.logo?.src}
            alt={record.name}
            sx={{
                '& img': { objectFit: 'contain' },
            }}
            sizes={size}
        >
            {record.name.charAt(0)}
        </Avatar>
    );
};
