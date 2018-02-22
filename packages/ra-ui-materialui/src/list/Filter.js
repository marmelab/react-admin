import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import { withStyles } from 'material-ui/styles';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';
import { removeEmpty } from 'ra-core';

const styles = {
    button: {},
    form: {},
};

export class Filter extends Component {
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

    setFilters = debounce(filters => {
        if (!isEqual(filters, this.filters)) {
            // fix for redux-form bug with onChange and enableReinitialize
            const filtersWithoutEmpty = removeEmpty(filters);
            this.props.setFilters(filtersWithoutEmpty);
            this.filters = filtersWithoutEmpty;
        }
    }, this.props.debounce);

    renderButton() {
        const {
            classes = {},
            context,
            debounce,
            resource,
            children,
            showFilter,
            hideFilter,
            displayedFilters,
            filterValues,
            ...rest
        } = this.props;

        return (
            <FilterButton
                className={classes.button}
                resource={resource}
                filters={React.Children.toArray(children)}
                showFilter={showFilter}
                displayedFilters={displayedFilters}
                filterValues={filterValues}
                {...rest}
            />
        );
    }

    renderForm() {
        const {
            classes = {},
            context,
            debounce,
            resource,
            children,
            hideFilter,
            displayedFilters,
            showFilter,
            filterValues,
            setFilters,
            ...rest
        } = this.props;

        return (
            <FilterForm
                className={classes.form}
                resource={resource}
                filters={React.Children.toArray(children)}
                hideFilter={hideFilter}
                displayedFilters={displayedFilters}
                initialValues={filterValues}
                setFilters={this.setFilters}
                {...rest}
            />
        );
    }

    render() {
        return this.props.context === 'button'
            ? this.renderButton()
            : this.renderForm();
    }
}

Filter.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
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

export default withStyles(styles)(Filter);
