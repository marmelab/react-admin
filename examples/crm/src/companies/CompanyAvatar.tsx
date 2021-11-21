import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import clsx from 'clsx';

import { Company } from '../types';

const PREFIX = 'CompanyAvatar';

const classes = {
    avatar: `${PREFIX}-avatar`,
    img: `${PREFIX}-img`,
    small: `${PREFIX}-small`,
    large: `${PREFIX}-large`,
};

const StyledAvatar = styled(Avatar)({
    [`& .${classes.avatar}`]: {
        width: 60,
        height: 60,
        backgroundColor: 'aliceblue',
    },
    [`& .${classes.img}`]: {
        objectFit: 'contain',
    },
    [`& .${classes.small}`]: {
        width: 20,
        height: 20,
    },
    [`& .${classes.large}`]: {
        width: 40,
        height: 40,
    },
});

export const CompanyAvatar = ({
    record,
    size = 'large',
}: {
    record?: Company;
    size?: 'small' | 'large';
}) => {
    if (!record) return null;
    return (
        <StyledAvatar
            src={process.env.PUBLIC_URL + record.logo}
            alt={record.name}
            className={classes.avatar}
            imgProps={{ className: clsx(classes.img, size) }}
        />
    );
};
