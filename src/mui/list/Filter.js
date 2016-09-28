import React, { PropTypes } from 'react';
import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const Filter = ({ resource, context, children, showFilter, hideFilter, displayedFilters, filterValues }) => context == 'form' ?
    React.createElement(FilterForm, { resource, filters: React.Children.toArray(children), hideFilter, displayedFilters, filterValues }) :
    React.createElement(FilterButton, { resource, filters: React.Children.toArray(children), showFilter, displayedFilters, filterValues });

Filter.propTypes = {
    resource: PropTypes.string.isRequired,
    context: React.PropTypes.oneOf(['form', 'button']),
    showFilter: React.PropTypes.func,
    hideFilter: React.PropTypes.func,
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
};

export default Filter;
