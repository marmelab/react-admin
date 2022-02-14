import * as React from 'react';
import { useListFilterContext, useGetIdentity } from 'react-admin';
import { Box, Switch, FormControlLabel } from '@mui/material';

export const OnlyMineInput = ({ alwaysOn }: { alwaysOn: boolean }) => {
    const {
        filterValues,
        displayedFilters,
        setFilters,
    } = useListFilterContext();
    const { identity } = useGetIdentity();

    const handleChange = () => {
        const index = filterValues.findIndex(
            filter => filter.field === 'sales_id'
        );
        const newFilterValues =
            index !== -1
                ? filterValues
                      .slice(0, index)
                      .concat(filterValues.slice(index + 1))
                : [
                      ...filterValues,
                      {
                          field: 'sales_id',
                          value: identity && identity?.id,
                      },
                  ];

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

OnlyMineInput.defaultProps = { source: 'sales_id' };
