import { Avatar as MuiAvatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

import { Contact } from '../types';

export const Avatar = (props: {
    record?: Contact;
    width?: number;
    height?: number;
    title?: string;
}) => {
    const record = useRecordContext<Contact>(props);
    // If we come from company page, the record is defined (to pass the company as a prop),
    // but neither of those fields are and this lead to an error when creating contact.
    if (!record?.avatar && !record?.first_name && !record?.last_name) {
        return null;
    }

    return (
        <MuiAvatar
            src={record.avatar?.src ?? undefined}
            sx={{
                width: props.width,
                height: props.height,
                fontSize: props.height ? '0.6rem' : undefined,
            }}
            title={props.title}
        >
            {record.first_name?.charAt(0).toUpperCase()}
            {record.last_name?.charAt(0).toUpperCase()}
        </MuiAvatar>
    );
};
