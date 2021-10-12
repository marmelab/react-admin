import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useListFilterContext, useGetIdentity } from 'react-admin';
import { Switch, FormControlLabel } from '@mui/material';

const PREFIX = 'OnlyMineInput';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
}));

export const OnlyMineInput = ({ alwaysOn }: { alwaysOn: boolean }) => {
    const {
        filterValues,
        displayedFilters,
        setFilters,
    } = useListFilterContext();
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
        <Root className={classes.root}>
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
        </Root>
    );
};

OnlyMineInput.defaultProps = { source: 'sales_id' };
