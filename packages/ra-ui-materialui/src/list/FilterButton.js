import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ContentFilter from '@material-ui/icons/FilterList';
import classnames from 'classnames';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

import FilterButtonMenuItem from './FilterButtonMenuItem';
import Button from '../button/Button';

const styles = createStyles({
    root: { display: 'inline-block' },
});

export class FilterButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
        };
        this.handleClickButton = this.handleClickButton.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    getHiddenFilters() {
        const { filters, displayedFilters, filterValues } = this.props;
        return filters.filter(
            filterElement =>
                !filterElement.props.alwaysOn &&
                !displayedFilters[filterElement.props.source] &&
                !filterValues[filterElement.props.source]
        );
    }

    handleClickButton(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleShow({ source, defaultValue }) {
        this.props.showFilter(source, defaultValue);
        this.setState({
            open: false,
        });
    }

    render() {
        const hiddenFilters = this.getHiddenFilters();
        const {
            classes = {},
            className,
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            translate,
            ...rest
        } = this.props;
        const { open, anchorEl } = this.state;

        return (
            hiddenFilters.length > 0 && (
                <div className={classnames(classes.root, className)} {...rest}>
                    <Button
                        className="add-filter"
                        label="ra.action.add_filter"
                        onClick={this.handleClickButton}
                    >
                        <ContentFilter />
                    </Button>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={this.handleRequestClose}
                    >
                        {hiddenFilters.map(filterElement => (
                            <FilterButtonMenuItem
                                key={filterElement.props.source}
                                filter={filterElement.props}
                                resource={resource}
                                onShow={this.handleShow}
                            />
                        ))}
                    </Menu>
                </div>
            )
        );
    }
}

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default compose(
    translate,
    withStyles(styles)
)(FilterButton);
