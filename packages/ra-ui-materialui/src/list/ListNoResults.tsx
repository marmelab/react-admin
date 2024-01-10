import * as React from 'react';
import { memo } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useResourceContext, useTranslate } from 'ra-core';

export const ListNoResults = memo(() => {
    const translate = useTranslate();
    const resource = useResourceContext();
    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results', { resource })}
            </Typography>
        </CardContent>
    );
});
