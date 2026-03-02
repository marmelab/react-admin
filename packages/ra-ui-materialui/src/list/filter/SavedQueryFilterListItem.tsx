import * as React from 'react';
import { memo } from 'react';
import {
    IconButton,
    ListItem,
    ListItemButton,
    type ListItemProps,
    ListItemText,
    styled,
    type ComponentsOverrides,
    useThemeProps,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import isEqual from 'lodash/isEqual.js';
import { useListContext, SavedQuery } from 'ra-core';

const arePropsEqual = (
    prevProps: SavedQueryFilterListItemProps,
    nextProps: SavedQueryFilterListItemProps
): boolean =>
    prevProps.label === nextProps.label &&
    isEqual(prevProps.value, nextProps.value);

export const SavedQueryFilterListItem = memo(
    (inProps: SavedQueryFilterListItemProps) => {
        const props = useThemeProps({
            props: inProps,
            name: PREFIX,
        });
        const { className, label, sx, value } = props;
        const {
            filterValues,
            sort,
            perPage,
            displayedFilters,
            setFilters,
            setPage,
        } = useListContext();

        const isSelected = isEqual(value, {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        });

        const addFilter = (): void => {
            setFilters(value.filter, value.displayedFilters);
            setPage(1);
        };

        const removeFilter = (): void => {
            setFilters({}, {});
            setPage(1);
        };

        const toggleFilter = (): void =>
            isSelected ? removeFilter() : addFilter();

        return (
            <StyledListItem
                className={className}
                sx={sx}
                disablePadding
                disableGutters
                secondaryAction={
                    isSelected ? (
                        <IconButton size="small" onClick={toggleFilter}>
                            <CancelIcon />
                        </IconButton>
                    ) : null
                }
            >
                <ListItemButton
                    onClick={toggleFilter}
                    selected={isSelected}
                    className={SavedQueryFilterListItemClasses.listItemButton}
                >
                    <ListItemText
                        primary={label}
                        className={SavedQueryFilterListItemClasses.listItemText}
                    />
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSavedQueryFilterListItem: 'root' | 'listItemButton' | 'listItemText';
    }

    interface ComponentsPropsList {
        RaSavedQueryFilterListItem: Partial<SavedQueryFilterListItemProps>;
    }

    interface Components {
        RaSavedQueryFilterListItem?: {
            defaultProps?: ComponentsPropsList['RaSavedQueryFilterListItem'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSavedQueryFilterListItem'];
        };
    }
}
