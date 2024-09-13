import * as React from 'react';
import { CardContent, Typography } from '@mui/material';
import { useListContext, useResourceContext, useTranslate } from 'ra-core';

import { Button } from '../button';

export const ListNoResults = () => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const { filterValues, setFilters } = useListContext();
    return (
        <CardContent>
            <Typography variant="body2">
                {filterValues && Object.keys(filterValues).length > 0 ? (
                    <>
                        {translate('ra.navigation.no_filtered_results', {
                            resource,
                            _: 'No results found with the current filters.',
                        })}{' '}
                        <Button
                            onClick={() => setFilters({}, [])}
                            label={translate('ra.navigation.clear_filters', {
                                _: 'Clear filters',
                            })}
                        />
                    </>
                ) : (
                    translate('ra.navigation.no_results', {
                        resource,
                        _: 'No results found.',
                    })
                )}
            </Typography>
        </CardContent>
    );
};
