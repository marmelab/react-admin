import * as React from 'react';
import { memo } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'ra-core';

/**
 * @deprecated Empty state should be handled by the component displaying data (Datagrid, SimpleList).
 */
export const PaginationLimit = memo(() => {
    const translate = useTranslate();
    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results')}
            </Typography>
        </CardContent>
    );
});
