import * as React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export const TitlePortal = (props: TypographyProps) => (
    <Typography
        variant="h6"
        color="inherit"
        id="react-admin-title"
        {...props}
        sx={[
            {
                flex: '1',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
    />
);
