import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { FieldTitle } from 'ra-core';

class FilterButtonMenuItem extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        onShow: PropTypes.func.isRequired,
        resource: PropTypes.string.isRequired,
    };

    handleShow = () => {
        const { filter, onShow } = this.props;
        onShow({ source: filter.source, defaultValue: filter.defaultValue });
    };

    render() {
        const { filter, resource } = this.props;

        return (
            <MenuItem
                className="new-filter-item"
                data-key={filter.source}
                data-default-value={filter.defaultValue}
                key={filter.source}
                onClick={this.handleShow}
            >
                <FieldTitle label={filter.label} source={filter.source} resource={resource} />
            </MenuItem>
        );
    }
}

export default FilterButtonMenuItem;
