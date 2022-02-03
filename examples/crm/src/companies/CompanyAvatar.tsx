import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import clsx from 'clsx';
import { useRecordContext } from 'react-admin';

import { Company } from '../types';

const PREFIX = 'CompanyAvatar';

const classes = {
    avatar: `${PREFIX}-avatar`,
    img: `${PREFIX}-img`,
    small: `${PREFIX}-small`,
    large: `${PREFIX}-large`,
};

const StyledAvatar = styled(Avatar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
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
            className={classes.avatar}
            imgProps={{ className: clsx(classes.img, size) }}
        />
    );
};
