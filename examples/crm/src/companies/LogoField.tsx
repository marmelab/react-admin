import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    image: {
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
    const classes = useStyles();
    if (!record) return null;
    return (
        <img
            src={process.env.PUBLIC_URL + record.logo}
            alt={record.name}
            title={record.name}
            width={sizeInPixel[size]}
            height={sizeInPixel[size]}
            className={classes.image}
        />
    );
};
