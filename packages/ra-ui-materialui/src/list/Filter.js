import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { sanitizeListRestProps } from 'ra-core';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const useStyles = makeStyles(theme => ({
    button: {},
    form: {
        marginBottom: theme.spacing(1),
    },
}));

const Filter = ({
    context,
    resource,
    children,
    showFilter,
    hideFilter,
    displayedFilters,
    filterValues,
    setFilters,
    ...rest
}) => {
    const classes = useStyles();

    const renderButton = () => {
        return (
            <FilterButton
                className={classes.button}
                resource={resource}
                filters={React.Children.toArray(children)}
                showFilter={showFilter}
                displayedFilters={displayedFilters}
                filterValues={filterValues}
                {...sanitizeListRestProps(rest)}
            />
        );
    };

    const renderForm = () => {
        return (
            <FilterForm
                className={classes.form}
                resource={resource}
                filters={React.Children.toArray(children)}
                hideFilter={hideFilter}
                displayedFilters={displayedFilters}
                initialValues={filterValues}
                setFilters={setFilters}
                {...sanitizeListRestProps(rest)}
            />
        );
    };

    return context === 'button' ? renderButton() : renderForm();
};

Filter.propTypes = {
    children: PropTypes.node,
    context: PropTypes.oneOf(['form', 'button']),
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
    hideFilter: PropTypes.func,
    setFilters: PropTypes.func,
    showFilter: PropTypes.func,
    resource: PropTypes.string.isRequired,
};

export default Filter;
