import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { sanitizeListRestProps } from 'ra-core';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const useStyles = makeStyles(
    {
        button: {},
        form: {},
    },
    { name: 'RaFilter' }
);

const Filter = props => {
    const classes = useStyles({ classes: props.classes });
    const renderButton = () => {
        const {
            classes: classesOverride,
            context,
            resource,
            children,
            showFilter,
            hideFilter,
            displayedFilters,
            filterValues,
            variant,
            ...rest
        } = props;

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
        const {
            classes: classesOverride,
            context,
            resource,
            children,
            hideFilter,
            displayedFilters,
            showFilter,
            filterValues,
            setFilters,
            ...rest
        } = props;

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

    return props.context === 'button' ? renderButton() : renderForm();
};

Filter.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    context: PropTypes.oneOf(['form', 'button']),
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
    hideFilter: PropTypes.func,
    setFilters: PropTypes.func,
    showFilter: PropTypes.func,
    resource: PropTypes.string.isRequired,
};

export default Filter;
