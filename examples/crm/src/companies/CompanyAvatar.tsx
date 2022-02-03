import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import clsx from 'clsx';
import { useRecordContext } from 'react-admin';

import { Company } from '../types';

const PREFIX = 'CompanyAvatar';

const classes = {
    img: `${PREFIX}-img`,
};

const StyledAvatar = styled(Avatar)({
    [`& .${classes.img}`]: {
        objectFit: 'contain',
    },
});

export const CompanyAvatar = (props: {
    record?: Company;
    size?: 'small' | 'large';
}) => {
    const { size = 'large' } = props;
    const record = useRecordContext<Company>(props);
    if (!record) return null;
    return (
        <StyledAvatar
            src={process.env.PUBLIC_URL + record.logo}
            alt={record.name}
            sx={{ bgcolor: 'aliceblue' }}
            imgProps={{ className: clsx(classes.img, size) }}
        />
    );
};
