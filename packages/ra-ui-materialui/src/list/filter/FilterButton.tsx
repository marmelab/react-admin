import * as React from 'react';
import {
    useState,
    useCallback,
    useRef,
    ReactNode,
    HtmlHTMLAttributes,
    useContext,
} from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    styled,
    ButtonProps as MuiButtonProps,
    Divider,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ContentFilter from '@mui/icons-material/FilterList';
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

export const FilterButton = (props: FilterButtonProps) => {
    const {
        filters: filtersProp,
        className,
        disableSaveQuery,
        size,
        variant,
        ...rest
    } = props;
    const filters = useContext(FilterContext) || filtersProp;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    if (!resource && !disableSaveQuery) {
        throw new Error(
            '<FilterButton> must be called inside a ResourceContextProvider, or must provide a resource prop'
        );
    }
    const [savedQueries] = useSavedQueries(resource || '');
    const navigate = useNavigate();
    const {
        displayedFilters = {},
        filterValues,
        perPage,
        setFilters,
        showFilter,
        hideFilter,
        sort,
    } = useListContext();
    const hasFilterValues = !isEqual(filterValues, {});
    const validSavedQueries = extractValidSavedQueries(savedQueries);
    const hasSavedCurrentQuery = validSavedQueries.some(savedQuery =>
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
        throw new Error(
            'The <FilterButton> component requires the <List filters> prop to be set'
        );
    }

    const allTogglableFilters = filters.filter(
        (filterElement: JSX.Element) => !filterElement.props.alwaysOn
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
            // We have to fallback to imperative code because the new FilterFormInput
            // has no way of knowing it has just been displayed (and thus that it should focus its input)
            setTimeout(() => {
                const inputElement = document.querySelector(
                    `input[name='${source}']`
                ) as HTMLInputElement;
                if (inputElement) {
                    inputElement.focus();
                }
            }, 50);
            setOpen(false);
        },
        [showFilter, setOpen]
    );

    const handleRemove = useCallback(
        ({ source }) => {
            hideFilter(source);
            setOpen(false);
        },
        [hideFilter, setOpen]
    );

    // add query dialog state
    const [addSavedQueryDialogOpen, setAddSavedQueryDialogOpen] =
        useState(false);
    const hideAddSavedQueryDialog = (): void => {
        setAddSavedQueryDialogOpen(false);
    };
    const showAddSavedQueryDialog = (): void => {
        setOpen(false);
        setAddSavedQueryDialogOpen(true);
    };

    // remove query dialog state
    const [removeSavedQueryDialogOpen, setRemoveSavedQueryDialogOpen] =
        useState(false);
    const hideRemoveSavedQueryDialog = (): void => {
        setRemoveSavedQueryDialogOpen(false);
    };
    const showRemoveSavedQueryDialog = (): void => {
        setOpen(false);
        setRemoveSavedQueryDialogOpen(true);
    };

    if (
        allTogglableFilters.length === 0 &&
        validSavedQueries.length === 0 &&
        !hasFilterValues
    ) {
        return null;
    }
    return (
        <Root className={className} {...sanitizeRestProps(rest)}>
            <Button
                className="add-filter"
                label="ra.action.add_filter"
                aria-haspopup="true"
                onClick={handleClickButton}
                variant={variant}
                size={size}
            >
                <ContentFilter />
            </Button>
            <Menu
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleRequestClose}
            >
                {allTogglableFilters.map(
                    (filterElement: JSX.Element, index) => (
                        <FilterButtonMenuItem
                            key={filterElement.props.source}
                            filter={filterElement}
                            displayed={
                                !!displayedFilters[filterElement.props.source]
                            }
                            resource={resource}
                            onShow={handleShow}
                            onHide={handleRemove}
                            autoFocus={index === 0}
                        />
                    )
                )}
                {(hasFilterValues || validSavedQueries.length > 0) && (
                    <Divider />
                )}
                {validSavedQueries.map((savedQuery, index) =>
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
                            <ListItemIcon>
                                <BookmarkRemoveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                {translate(
                                    'ra.saved_queries.remove_label_with_name',
                                    {
                                        _: 'Remove query "%{name}"',
                                        name: savedQuery.label,
                                    }
                                )}
                            </ListItemText>
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={(): void => {
                                navigate({
                                    search: stringify({
                                        filter: JSON.stringify(
                                            savedQuery.value.filter
                                        ),
                                        sort: savedQuery.value.sort?.field,
                                        order: savedQuery.value.sort?.order,
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
                            <ListItemIcon>
                                <BookmarkBorderIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{savedQuery.label}</ListItemText>
                        </MenuItem>
                    )
                )}
                {hasFilterValues &&
                    !hasSavedCurrentQuery &&
                    !disableSaveQuery && (
                        <MenuItem onClick={showAddSavedQueryDialog}>
                            <ListItemIcon>
                                <BookmarkAddIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                {translate('ra.saved_queries.new_label', {
                                    _: 'Save current query...',
                                })}
                            </ListItemText>
                        </MenuItem>
                    )}
                {hasFilterValues && (
                    <MenuItem
                        onClick={() => {
                            setFilters({}, {});
                            setOpen(false);
                        }}
                    >
                        <ListItemIcon>
                            <ClearIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            {translate('ra.action.remove_all_filters', {
                                _: 'Remove all filters',
                            })}
                        </ListItemText>
                    </MenuItem>
                )}
            </Menu>
            {!disableSaveQuery && (
                <>
                    <AddSavedQueryDialog
                        open={addSavedQueryDialogOpen}
                        onClose={hideAddSavedQueryDialog}
                    />
                    <RemoveSavedQueryDialog
                        open={removeSavedQueryDialogOpen}
                        onClose={hideRemoveSavedQueryDialog}
                    />
                </>
            )}
        </Root>
    );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    displayedFilters = null,
    filterValues = null,
    showFilter = null,
    ...rest
}) => rest;

export interface FilterButtonProps
    extends HtmlHTMLAttributes<HTMLDivElement>,
        Pick<MuiButtonProps, 'variant' | 'size'> {
    className?: string;
    disableSaveQuery?: boolean;
    filters?: ReactNode[];
    resource?: string;
}

const PREFIX = 'RaFilterButton';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-block',
});
