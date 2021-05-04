import * as React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';

import { Contact } from '../types';

export const Avatar = ({ record }: { record: Contact }) => (
    <MuiAvatar src={record.avatar}>
        {record.first_name.charAt(0)}
        {record.last_name.charAt(0)}
    </MuiAvatar>
);
