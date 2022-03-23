import * as React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

import { Contact } from '../types';

export const Avatar = (props: { record?: Contact }) => {
    const record = useRecordContext<Contact>(props);
    if (!record) return null;

    return (
        <MuiAvatar src={record.avatar}>
            {record.first_name.charAt(0)}
            {record.last_name.charAt(0)}
        </MuiAvatar>
    );
};
