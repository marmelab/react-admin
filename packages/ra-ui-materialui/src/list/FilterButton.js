import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ContentFilter from '@material-ui/icons/FilterList';
import classnames from 'classnames';
import lodashGet from 'lodash/get';

import FilterButtonMenuItem from './FilterButtonMenuItem';
import Button from '../button/Button';

const useStyles = makeStyles(
    {
        root: { display: 'inline-block' },
    },
    { name: 'RaFilterButton' }
);

const FilterButton = ({
    filters,
    displayedFilters,
    filterValues,
    showFilter,
    classes: classesOverride,
    className,
    resource,
    ...rest
}) => {
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();
    const classes = useStyles({ classes: classesOverride });

    const hiddenFilters = filters.filter(
        filterElement =>
            !filterElement.props.alwaysOn &&
            !displayedFilters[filterElement.props.source] &&
            typeof lodashGet(filterValues, filterElement.props.source) ===
                'undefined'
    );

    const handleClickButton = useCallback(
        event => {
            // This prevents ghost click.
            event.preventDefault();
            setOpen(true);
            anchorEl.current = event.currentTarget;
        },
        [anchorEl, setOpen]
    );

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleShow = useCallback(
        ({ source, defaultValue }) => {
            showFilter(source, defaultValue);
            setOpen(false);
        },
        [showFilter, setOpen]
    );

    if (hiddenFilters.length === 0) return null;
    return (
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
                anchorEl={anchorEl.current}
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
    );
};

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default FilterButton;
