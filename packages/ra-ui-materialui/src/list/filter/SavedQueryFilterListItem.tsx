import * as React from 'react';
import { ReactElement, memo } from 'react';
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemProps,
    ListItemText,
    ListItemSecondaryAction,
    styled,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import isEqual from 'lodash/isEqual';
import { useNavigate } from 'react-router-dom';
import { stringify } from 'query-string';
import { useListContext } from 'ra-core';

import { SavedQuery } from './useSavedQueries';

const arePropsEqual = (
    prevProps: SavedQueryFilterListItemProps,
    nextProps: SavedQueryFilterListItemProps
): boolean =>
    prevProps.label === nextProps.label &&
    isEqual(prevProps.value, nextProps.value);

export const SavedQueryFilterListItem = memo(
    (props: SavedQueryFilterListItemProps): ReactElement => {
        const { className, label, sx, value } = props;
        const { filterValues, sort, perPage, displayedFilters } =
            useListContext();
        const navigate = useNavigate();

        const isSelected = isEqual(value, {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        });

        const addFilter = (): void => {
            navigate({
                search: stringify({
                    filter: JSON.stringify(value.filter),
                    sort: value.sort?.field,
                    order: value.sort?.order,
                    page: 1,
                    perPage: value.perPage ?? perPage,
                    displayedFilters: JSON.stringify(value.displayedFilters),
                }),
            });
        };

        const removeFilter = (): void => {
            navigate({
                search: stringify({
                    filter: JSON.stringify({}),
                }),
            });
        };

        const toggleFilter = (): void =>
            isSelected ? removeFilter() : addFilter();

        return (
            // @ts-ignore
            <StyledListItem
                onClick={toggleFilter}
                selected={isSelected}
                className={className}
                sx={sx}
                disablePadding
            >
                <ListItemButton
                    disableGutters
                    className={SavedQueryFilterListItemClasses.listItemButton}
                >
                    <ListItemText
                        primary={label}
                        className={SavedQueryFilterListItemClasses.listItemText}
                    />
                    {isSelected && (
                        <ListItemSecondaryAction>
                            <IconButton size="small" onClick={toggleFilter}>
                                <CancelIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </ListItemButton>
            </StyledListItem>
        );
    },
    arePropsEqual
);

const PREFIX = 'RaSavedQueryFilterListItem';
export const SavedQueryFilterListItemClasses = {
    listItemButton: `${PREFIX}-listItemButton`,
    listItemText: `${PREFIX}-listItemText`,
};

const StyledListItem = styled(ListItem, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    [`& .${SavedQueryFilterListItemClasses.listItemButton}`]: {
        paddingRight: '2em',
        paddingLeft: '2em',
    },
    [`& .${SavedQueryFilterListItemClasses.listItemText}`]: {
        margin: 0,
    },
}));

export interface SavedQueryFilterListItemProps
    extends SavedQuery,
        Omit<ListItemProps, 'value'> {}
