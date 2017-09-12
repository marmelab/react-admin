import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import shallowEqual from 'recompose/shallowEqual';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.filters = this.props.filterValues;
    }

    componentWillReceiveProps(nextProps) {
        this.filters = nextProps.filterValues;
    }

    componentWillUnmount() {
        if (this.props.setFilters) {
            this.setFilters.cancel();
        }
    }

    setFilters = debounce((filters) => {
        if (!shallowEqual(filters, this.filters)) { // fix for redux-form bug with onChange and enableReinitialize
            const filtersWithoutEmpty = filters;
            Object.keys(filtersWithoutEmpty).forEach((filterName) => {
                if (filtersWithoutEmpty[filterName] === '') {
                    // remove empty filter from query
                    delete filtersWithoutEmpty[filterName];
                }
            })
            this.props.setFilters(filtersWithoutEmpty);
            this.filters = filtersWithoutEmpty;
        }
    }, this.props.debounce)

    renderButton() {
        const { resource, children, showFilter, displayedFilters, filterValues } = this.props;
        return (
            <FilterButton
                resource={resource}
                filters={React.Children.toArray(children)}
                showFilter={showFilter}
                displayedFilters={displayedFilters}
                filterValues={filterValues}
            />
        );
    }

    renderForm() {
        const { resource, children, hideFilter, displayedFilters, filterValues } = this.props;
        return (
            <FilterForm
                resource={resource}
                filters={React.Children.toArray(children)}
                hideFilter={hideFilter}
                displayedFilters={displayedFilters}
                initialValues={filterValues}
                setFilters={this.setFilters}
            />
        );
    }

    render() {
        return this.props.context === 'button' ? this.renderButton() : this.renderForm();
    }
}

Filter.propTypes = {
    children: PropTypes.node,
    context: PropTypes.oneOf(['form', 'button']),
    debounce: PropTypes.number.isRequired,
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
    hideFilter: PropTypes.func,
    setFilters: PropTypes.func,
    showFilter: PropTypes.func,
    resource: PropTypes.string.isRequired,
};

Filter.defaultProps = {
    debounce: 500,
};

export default Filter;
