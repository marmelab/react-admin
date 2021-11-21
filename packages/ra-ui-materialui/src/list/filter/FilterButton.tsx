import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    useState,
    useCallback,
    useRef,
    ReactNode,
    HtmlHTMLAttributes,
    useContext,
} from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import ContentFilter from '@mui/icons-material/FilterList';
import classnames from 'classnames';
import lodashGet from 'lodash/get';
import { useListContext, useResourceContext } from 'ra-core';

import { FilterButtonMenuItem } from './FilterButtonMenuItem';
import { Button } from '../../button';
import { FilterContext } from '../FilterContext';

export const FilterButton = (props: FilterButtonProps): JSX.Element => {
    const { filters: filtersProp, className, ...rest } = props;
    const filters = useContext(FilterContext) || filtersProp;
    const resource = useResourceContext(props);
    const { displayedFilters = {}, filterValues, showFilter } = useListContext(
        props
    );
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();

    const hiddenFilters = filters.filter(
        (filterElement: JSX.Element) =>
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
        <Root
            className={classnames(FilterButtonClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
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
                {hiddenFilters.map((filterElement: JSX.Element) => (
                    <FilterButtonMenuItem
                        key={filterElement.props.source}
                        filter={filterElement}
                        resource={resource}
                        onShow={handleShow}
                    />
                ))}
            </Menu>
        </Root>
    );
};

const sanitizeRestProps = ({
    displayedFilters = null,
    filterValues = null,
    showFilter = null,
    ...rest
}) => rest;

FilterButton.propTypes = {
    resource: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.node),
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object,
    showFilter: PropTypes.func,
    className: PropTypes.string,
};

export interface FilterButtonProps extends HtmlHTMLAttributes<HTMLDivElement> {
    className?: string;
    resource?: string;
    filterValues?: any;
    showFilter?: (filterName: string, defaultValue: any) => void;
    displayedFilters?: any;
    filters?: ReactNode[];
}

const PREFIX = 'RaFilterButton';

export const FilterButtonClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${FilterButtonClasses.root}`]: { display: 'inline-block' },
}));
