import * as React from 'react';
import { useListFilterContext, useGetIdentity } from 'react-admin';
import { Box, Switch, FormControlLabel } from '@mui/material';

export const OnlyMineInput = (_: { alwaysOn: boolean; source: string }) => {
    const { filterValues, displayedFilters, setFilters } =
        useListFilterContext();
    const { identity } = useGetIdentity();

    const handleChange = () => {
        const newFilterValues = { ...filterValues };
        if (typeof filterValues.sales_id !== 'undefined') {
            delete newFilterValues.sales_id;
        } else {
            newFilterValues.sales_id = identity && identity?.id;
        }
        setFilters(newFilterValues, displayedFilters);
    };
    return (
        <Box sx={{ marginBottom: 1, marginLeft: 1 }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={typeof filterValues.sales_id !== 'undefined'}
                        onChange={handleChange}
                        color="primary"
                        name="checkedC"
                    />
                }
                label="Only companies I manage"
            />
        </Box>
    );
};
