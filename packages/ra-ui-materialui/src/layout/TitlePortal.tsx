import * as React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export const TitlePortal = (props: TypographyProps) => (
    <Typography
        flex="1"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
        variant="h6"
        color="inherit"
        id="react-admin-title"
        {...props}
    />
);
