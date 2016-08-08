import React, { PropTypes } from 'react';
import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

const Filter = ({ resource, context, children }) => context == 'form' ?
    React.createElement(FilterForm, { resource, filters: React.Children.toArray(children) }) :
    React.createElement(FilterButton, { resource, filters: React.Children.toArray(children) });

Filter.propTypes = {
    resource: PropTypes.string.isRequired,
    context: React.PropTypes.oneOf(['form', 'button']),
};

export default Filter;
