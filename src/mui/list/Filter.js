import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';

class Filter extends Component {
    constructor(props) {
        super(props);
        if (props.setFilters) {
            this.debouncedSetFilters = debounce(props.setFilters, 500);
        }
    }
    componentWillUnmount() {
        this.debouncedSetFilters.cancel();
    }
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
                setFilters={this.debouncedSetFilters}
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
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
    hideFilter: React.PropTypes.func,
    setFilters: PropTypes.func,
    showFilter: React.PropTypes.func,
    resource: PropTypes.string.isRequired,
};

export default Filter;
