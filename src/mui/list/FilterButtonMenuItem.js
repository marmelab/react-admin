import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import FieldTitle from '../../util/FieldTitle';

class FilterButtonMenuItem extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        onShow: PropTypes.func.isRequired,
        resource: PropTypes.string.isRequired,
    }

    handleShow = () => {
        const { filter, onShow } = this.props;
        onShow({ source: filter.source, defaultValue: filter.defaultValue });
    }

    render() {
        const { filter, resource } = this.props;

        return (
            <MenuItem
                className="new-filter-item"
                data-key={filter.source}
                data-default-value={filter.defaultValue}
                key={filter.source}
                primaryText={<FieldTitle label={filter.label} source={filter.source} resource={resource} />}
                onTouchTap={this.handleShow}
            />
        );
    }
}

export default FilterButtonMenuItem;
