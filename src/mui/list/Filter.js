import React, { PropTypes } from 'react';
import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const Filter = ({ resource, context, children, setFilter, showFilter, hideFilter, displayedFilters, filterValues }) => context == 'form' ?
    React.createElement(FilterForm, { resource, filters: React.Children.toArray(children), setFilter, hideFilter, displayedFilters, filterValues }) :
    React.createElement(FilterButton, { resource, filters: React.Children.toArray(children), showFilter, displayedFilters, filterValues });

Filter.propTypes = {
    resource: PropTypes.string.isRequired,
    context: React.PropTypes.oneOf(['form', 'button']),
    setFilter: React.PropTypes.func,
    showFilter: React.PropTypes.func,
    hideFilter: React.PropTypes.func,
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
};

export default Filter;
