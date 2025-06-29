import * as React from 'react';
import { CardContent, Typography } from '@mui/material';
import {
    useGetResourceLabel,
    useListContextWithProps,
    useResourceContext,
    useTranslate,
} from 'ra-core';

import { Button } from '../button';

export const ListNoResults = (props: ListNoResultsProps) => {
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const { filterValues, setFilters } = useListContextWithProps(props);
    const getResourceLabel = useGetResourceLabel();
    if (!resource) {
        throw new Error(
            '<ListNoResults> must be used inside a <List> component'
        );
    }
    return (
        <CardContent>
            <Typography variant="body2">
                {filterValues &&
                setFilters &&
                Object.keys(filterValues).length > 0 ? (
                    <>
                        {translate('ra.navigation.no_filtered_results', {
                            resource,
                            name: getResourceLabel(resource, 0),
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
                        name: getResourceLabel(resource, 0),
                        _: 'No results found.',
                    })
                )}
            </Typography>
        </CardContent>
    );
};

export interface ListNoResultsProps {
    resource?: string;
    filterValues?: any;
    setFilters?: (filters: any, filterTypes?: string[]) => void;
}
