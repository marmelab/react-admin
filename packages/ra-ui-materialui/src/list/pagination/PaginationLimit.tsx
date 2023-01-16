import * as React from 'react';
import { memo, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'ra-core';

export const PaginationLimit = memo(() => {
    const translate = useTranslate();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                '<PaginationLimit> is deprecated. The pagination component renders null when there is no data.'
            );
        }
    }, []);

    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results')}
            </Typography>
        </CardContent>
    );
});
