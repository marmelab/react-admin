import * as React from 'react';
import { memo } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'ra-core';

const PaginationLimit = () => {
    const translate = useTranslate();
    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results')}
            </Typography>
        </CardContent>
    );
};

export default memo(PaginationLimit);
