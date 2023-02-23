import * as React from 'react';
import { Typography } from '@mui/material';

export const TitlePortal = ({ className }: { className?: string }) => (
    <Typography
        flex="1"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
        variant="h6"
        color="inherit"
        id="react-admin-title"
        className={className}
    />
);
