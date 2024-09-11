import * as React from 'react';
import { Avatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

import { Company } from '../types';

export const CompanyAvatar = (props: {
    record?: Company;
    width?: number;
    height?: number;
}) => {
    const { width = 40, height = 40 } = props;
    const record = useRecordContext<Company>(props);
    if (!record) return null;
    return (
        <Avatar
            src={record.logo?.src}
            alt={record.name}
            sx={{
                '& img': { objectFit: 'contain' },
                width,
                height,
                fontSize: height !== 40 ? '0.6rem' : undefined,
                '&.MuiAvatar-colorDefault': {
                    color: 'primary.contrastText',
                },
            }}
        >
            {record.name.charAt(0)}
        </Avatar>
    );
};
