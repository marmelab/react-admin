import * as React from 'react';
import { memo } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useListController, useResourceContext, useTranslate } from 'ra-core';
import { Link } from '@mui/material';

export const ListNoResults = memo(() => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const { filterValues, setFilters } = useListController({ resource });
    return (
        <CardContent>
            <Typography variant="body2">
                {translate('ra.navigation.no_results', { resource })}{' '}
                {filterValues && Object.keys(filterValues).length > 0 && (
                    <Link component="button" onClick={() => setFilters({}, [])}>
                        {translate('ra.navigation.clear_filters')}
                    </Link>
                )}
            </Typography>
        </CardContent>
    );
});
