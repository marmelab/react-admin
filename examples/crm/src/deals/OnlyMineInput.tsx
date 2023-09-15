import { Box, FormControlLabel, Switch } from '@mui/material';
import { useGetIdentity, useListFilterContext } from 'react-admin';

export const OnlyMineInput = (_: { alwaysOn: boolean }) => {
    const { filterValues, shownFilters, setFilters } = useListFilterContext();
    const { identity } = useGetIdentity();

    const handleChange = () => {
        const newFilterValues = { ...filterValues };
        if (typeof filterValues.sales_id !== 'undefined') {
            delete newFilterValues.sales_id;
        } else {
            newFilterValues.sales_id = identity && identity?.id;
        }
        setFilters(newFilterValues, shownFilters);
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
