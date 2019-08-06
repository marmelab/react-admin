import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ContentFilter from '@material-ui/icons/FilterList';
import classnames from 'classnames';
import lodashGet from 'lodash/get';

import FilterButtonMenuItem from './FilterButtonMenuItem';
import Button from '../button/Button';

const useStyles = makeStyles({
    root: { display: 'inline-block' },
});

export const FilterButton = ({
    className,
    resource,
    showFilter,
    displayedFilters,
    filterValues,
    filters,
    ...rest
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const getHiddenFilters = () => {
        return filters.filter(
            filterElement =>
                !filterElement.props.alwaysOn &&
                !displayedFilters[filterElement.props.source] &&
                typeof lodashGet(filterValues, filterElement.props.source) ===
                    'undefined'
        );
    };

    const handleClickButton = event => {
        // This prevents ghost click.
        event.preventDefault();
        setOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleRequestClose = () => {
        setOpen(false);
    };

    const handleShow = ({ source, defaultValue }) => {
        showFilter(source, defaultValue);
        setOpen(false);
    };

    const hiddenFilters = getHiddenFilters();

    return (
        hiddenFilters.length > 0 && (
            <div className={classnames(classes.root, className)} {...rest}>
                <Button
                    className="add-filter"
                    label="ra.action.add_filter"
                    onClick={handleClickButton}
                >
                    <ContentFilter />
                </Button>
                <Menu
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleRequestClose}
                >
                    {hiddenFilters.map(filterElement => (
                        <FilterButtonMenuItem
                            key={filterElement.props.source}
                            filter={filterElement.props}
                            resource={resource}
                            onShow={handleShow}
                        />
                    ))}
                </Menu>
            </div>
        )
    );
};

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default FilterButton;
