import React, { PropTypes } from 'react';
import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const Filter = ({ resource, context, children, showFilter, hideFilter, displayedFilters, filterValues }) => (
    context === 'form' ?
        <FilterForm
            resource={resource}
            filters={React.Children.toArray(children)}
            hideFilter={hideFilter}
            displayedFilters={displayedFilters}
            initialValues={filterValues}
        /> :
        <FilterButton
            resource={resource}
            filters={React.Children.toArray(children)}
            showFilter={showFilter}
            displayedFilters={displayedFilters}
            filterValues={filterValues}
        />
);

Filter.propTypes = {
    children: PropTypes.node,
    resource: PropTypes.string.isRequired,
    context: React.PropTypes.oneOf(['form', 'button']),
    showFilter: React.PropTypes.func,
    hideFilter: React.PropTypes.func,
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
};

export default Filter;
