import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Menu from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import ContentFilter from 'material-ui-icons/FilterList';
import classnames from 'classnames';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

import FilterButtonMenuItem from './FilterButtonMenuItem';
import Button from '../button/Button';

const styles = {
    root: { display: 'inline-block' },
    label: {
        marginLeft: '0.5em',
    },
};

export class FilterButton extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.state = {
            open: false,
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
            anchorEl: findDOMNode(this.button), // eslint-disable-line react/no-find-dom-node
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

    button = null;

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
                        ref={node => {
                            this.button = node;
                        }}
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

export default compose(translate, withStyles(styles))(FilterButton);
