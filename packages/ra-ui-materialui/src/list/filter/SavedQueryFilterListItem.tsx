import * as React from 'react';
import { ReactElement, memo } from 'react';
import {
    IconButton,
    ListItem,
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

const SavedQueryFilterListItem = (
    props: SavedQueryFilterListItemProps
): ReactElement => {
    const { label, value } = props;
    const { filterValues, sort, perPage, displayedFilters } = useListContext();
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
                sort: value.sort.field,
                order: value.sort.order,
                page: 1,
                perPage: value.perPage,
                displayedFilters: value.displayedFilters,
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
        <Root button onClick={toggleFilter} selected={isSelected}>
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
        </Root>
    );
};

const arePropsEqual = (
    prevProps: SavedQueryFilterListItemProps,
    nextProps: SavedQueryFilterListItemProps
): boolean =>
    prevProps.label === nextProps.label &&
    isEqual(prevProps.value, nextProps.value);

export default memo(SavedQueryFilterListItem, arePropsEqual);

const PREFIX = 'RaSavedQueryFilterListItem';
export const SavedQueryFilterListItemClasses = {
    listItemText: `${PREFIX}-listItemText`,
};

const Root = styled(ListItem, { name: PREFIX })(() => ({
    paddingLeft: '2em',
    [`& .${SavedQueryFilterListItemClasses.listItemText}`]: {
        margin: 0,
    },
}));

export type SavedQueryFilterListItemProps = SavedQuery;
