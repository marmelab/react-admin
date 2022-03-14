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
import { Menu, MenuItem, styled } from '@mui/material';
import ContentFilter from '@mui/icons-material/FilterList';
import lodashGet from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { useListContext, useResourceContext, useTranslate } from 'ra-core';
import { stringify } from 'query-string';
import { useNavigate } from 'react-router';

import { FilterButtonMenuItem } from './FilterButtonMenuItem';
import { Button } from '../../button';
import { FilterContext } from '../FilterContext';
import { extractValidSavedQueries, useSavedQueries } from './useSavedQueries';
import { AddSavedQueryDialog } from './AddSavedQueryDialog';
import { RemoveSavedQueryDialog } from './RemoveSavedQueryDialog';

export const FilterButton = (props: FilterButtonProps): JSX.Element => {
    const { filters: filtersProp, className, ...rest } = props;
    const filters = useContext(FilterContext) || filtersProp;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const [savedQueries] = useSavedQueries(resource);
    const navigate = useNavigate();
    const {
        displayedFilters = {},
        filterValues,
        perPage,
        showFilter,
        sort,
    } = useListContext(props);
    const hasFilterValues = !isEqual(filterValues, {});
    const hasSavedCurrentQuery = extractValidSavedQueries(savedQueries).some(
        savedQuery =>
            isEqual(savedQuery.value, {
                filter: filterValues,
                sort,
                perPage,
                displayedFilters,
            })
    );
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();

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
            showFilter(source, defaultValue === '' ? undefined : defaultValue);
            setOpen(false);
        },
        [showFilter, setOpen]
    );

    // add query dialog state
    const [addSavedQueryDialogOpen, setAddSavedQueryDialogOpen] = useState(
        false
    );
    const hideAddSavedQueryDialog = (): void => {
        setAddSavedQueryDialogOpen(false);
    };
    const showAddSavedQueryDialog = (): void => {
        setOpen(false);
        setAddSavedQueryDialogOpen(true);
    };

    // remove query dialog state
    const [
        removeSavedQueryDialogOpen,
        setRemoveSavedQueryDialogOpen,
    ] = useState(false);
    const hideRemoveSavedQueryDialog = (): void => {
        setRemoveSavedQueryDialogOpen(false);
    };
    const showRemoveSavedQueryDialog = (): void => {
        setOpen(false);
        setRemoveSavedQueryDialogOpen(true);
    };

    return (
        <Root className={className} {...sanitizeRestProps(rest)}>
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
                {savedQueries.map((savedQuery, index) =>
                    isEqual(savedQuery.value, {
                        filter: filterValues,
                        sort,
                        perPage,
                        displayedFilters,
                    }) ? (
                        <MenuItem
                            onClick={showRemoveSavedQueryDialog}
                            key={index}
                        >
                            {translate(
                                'ra.saved_queries.remove_label_with_name',
                                {
                                    _: 'Remove query "%{name}"',
                                    name: savedQuery.label,
                                }
                            )}
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={(): void => {
                                navigate({
                                    search: stringify({
                                        filter: JSON.stringify(
                                            savedQuery.value.filter
                                        ),
                                        sort: savedQuery.value.sort.field,
                                        order: savedQuery.value.sort.order,
                                        page: 1,
                                        perPage: savedQuery.value.perPage,
                                        displayedFilters: JSON.stringify(
                                            savedQuery.value.displayedFilters
                                        ),
                                    }),
                                });
                                setOpen(false);
                            }}
                            key={index}
                        >
                            {savedQuery.label}
                        </MenuItem>
                    )
                )}
                {hasFilterValues && !hasSavedCurrentQuery ? (
                    <MenuItem onClick={showAddSavedQueryDialog}>
                        {translate('ra.saved_queries.new_label', {
                            _: 'Save current query...',
                        })}
                    </MenuItem>
                ) : null}
            </Menu>
            <AddSavedQueryDialog
                open={addSavedQueryDialogOpen}
                onClose={hideAddSavedQueryDialog}
            />
            <RemoveSavedQueryDialog
                open={removeSavedQueryDialogOpen}
                onClose={hideRemoveSavedQueryDialog}
            />
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

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'inline-block',
}));
