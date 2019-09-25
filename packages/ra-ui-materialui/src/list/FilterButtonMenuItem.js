import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { FieldTitle } from 'ra-core';

const FilterButtonMenuItem = forwardRef(({ filter, onShow, resource }, ref) => {
    const handleShow = useCallback(() => {
        onShow({ source: filter.source, defaultValue: filter.defaultValue });
    }, [filter.defaultValue, filter.source, onShow]);

    return (
        <MenuItem
            className="new-filter-item"
            data-key={filter.source}
            data-default-value={filter.defaultValue}
            key={filter.source}
            onClick={handleShow}
            ref={ref}
        >
            <FieldTitle
                label={filter.label}
                source={filter.source}
                resource={resource}
            />
        </MenuItem>
    );
});

FilterButtonMenuItem.propTypes = {
    filter: PropTypes.object.isRequired,
    onShow: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
};

export default FilterButtonMenuItem;
