import * as React from 'react';
import { useListFilterContext, useGetIdentity } from 'react-admin';
import { Switch, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
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
    const classes = useStyles();
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
        <div className={classes.root}>
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
        </div>
    );
};

OnlyMineInput.defaultProps = { source: 'sales_id' };
