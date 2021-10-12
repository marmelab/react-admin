import * as React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'LogoField';

const classes = {
    image: `${PREFIX}-image`,
};

const StyledImage = styled('img')({
    [`&.${classes.image}`]: {
        objectFit: 'contain',
    },
});

const sizeInPixel = {
    medium: 42,
    small: 20,
};

export const LogoField = ({
    record,
    source,
    size = 'medium',
}: {
    record?: { logo: string; name: string };
    source?: string;
    size?: 'small' | 'medium';
}) => {
    if (!record) return null;
    return (
        <StyledImage
            src={process.env.PUBLIC_URL + record.logo}
            alt={record.name}
            title={record.name}
            width={sizeInPixel[size]}
            height={sizeInPixel[size]}
            className={classes.image}
        />
    );
};
