import { Avatar as MuiAvatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

import { Contact } from '../types';

export const Avatar = (props: {
    record?: Contact;
    width?: number;
    height?: number;
}) => {
    const record = useRecordContext<Contact>(props);
    if (!record) return null;

    return (
        <MuiAvatar
            src={record.avatar ?? undefined}
            sx={{
                width: props.width,
                height: props.height,
                fontSize: props.height ? '0.6rem' : undefined,
            }}
        >
            {record.first_name.charAt(0)}
            {record.last_name.charAt(0)}
        </MuiAvatar>
    );
};
