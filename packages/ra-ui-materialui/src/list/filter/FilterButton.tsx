import * as React from 'react';
import {
    useState,
    useCallback,
    useRef,
    ReactNode,
    HtmlHTMLAttributes,
    useContext,
} from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ContentFilter from '@material-ui/icons/FilterList';
import classnames from 'classnames';
import lodashGet from 'lodash/get';
import { useListContext, useResourceContext } from 'ra-core';

import { FilterButtonMenuItem } from './FilterButtonMenuItem';
import Button from '../../button/Button';
import { ClassesOverride } from '../../types';
import { FilterContext } from '../FilterContext';

const useStyles = makeStyles(
    {
        root: { display: 'inline-block' },
    },
    { name: 'RaFilterButton' }
);

const FilterButton = (props: FilterButtonProps): JSX.Element => {
    const {
        filters: filtersProp,
        classes: classesOverride,
        className,
        ...rest
    } = props;
    const filters = useContext(FilterContext) || filtersProp;
    const resource = useResourceContext(props);
    const { displayedFilters = {}, filterValues, showFilter } = useListContext(
        props
    );
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();
    const classes = useStyles(props);

    if (filters === undefined) {
        throw new Error('FilterButton requires filters prop to be set');
    }

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
        <div
            className={classnames(classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Button
                className="add-filter"
                label="ra.action.add_filter"
                aria-haspopup="true"
                onClick={handleClickButton}
            >
                <ContentFilter />
            </Button>
            <Menu
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleRequestClose}
            >
                {hiddenFilters.map((filterElement: JSX.Element, index) => (
                    <FilterButtonMenuItem
                        key={filterElement.props.source}
                        filter={filterElement}
                        resource={resource}
                        onShow={handleShow}
                        autoFocus={index === 0}
                    />
                ))}
            </Menu>
        </div>
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
    classes: PropTypes.object,
    className: PropTypes.string,
};

export interface FilterButtonProps extends HtmlHTMLAttributes<HTMLDivElement> {
    classes?: ClassesOverride<typeof useStyles>;
    className?: string;
    resource?: string;
    filterValues?: any;
    showFilter?: (filterName: string, defaultValue: any) => void;
    displayedFilters?: any;
    filters?: ReactNode[];
}

export default FilterButton;
