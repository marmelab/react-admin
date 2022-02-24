import * as React from 'react';
import { styled } from '@mui/material/styles';
import { memo, isValidElement, ReactElement } from 'react';
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { useTranslate, useListFilterContext, shallowEqual } from 'ra-core';
import matches from 'lodash/matches';
import pickBy from 'lodash/pickBy';

const arePropsEqual = (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    shallowEqual(prevProps.value, nextProps.value);

/**
 * Button to enable/disable a list filter.
 *
 * Expects 2 props:
 *
 * - label: The text (or React element) to be displayed for this item.
 *   If it's a string, the component will translate it.
 * - value: An object to be merged into the filter value when enabling the filter
 *   (e.g. { is_published: true, published_at_gte: '2020-07-08' })
 *
 * @example
 *
 * import * as React from 'react';
 * import { Card, CardContent } from '@mui/material';
 * import MailIcon from '@mui/icons-material/MailOutline';
 * import { FilterList, FilterListItem } from 'react-admin';
 *
 * const FilterSidebar = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterList
 *                 label="Subscribed to newsletter"
 *                 icon={<MailIcon />}
 *             >
 *                 <FilterListItem
 *                     label="Yes"
 *                     value={{ has_newsletter: true }}
 *                  />
 *                 <FilterListItem
 *                     label="No"
 *                     value={{ has_newsletter: false }}
 *                  />
 *             </FilterList>
 *         </CardContent>
 *     </Card>
 * );
 *
 * @example // The value prop can contain multiple keys
 *
 * import * as React from 'react';
 * import {
 *     endOfYesterday,
 *     startOfWeek,
 *     subWeeks,
 *     startOfMonth,
 *     subMonths,
 * } from 'date-fns';
 * import { Card, CardContent } from '@mui/material';
 * import AccessTimeIcon from '@mui/icons-material/AccessTime';
 * import { FilterList, FilterListItem } from 'react-admin';
 *
 * const FilterSidebar = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterList
 *                 label="Last visited"
 *                 icon={<AccessTimeIcon />}
 *             >
 *                 <FilterListItem
 *                     label="Today"
 *                     value={{
 *                         last_seen_gte: endOfYesterday().toISOString(),
 *                         last_seen_lte: undefined,
 *                     }}
 *                 />
 *                 <FilterListItem
 *                     label="This week"
 *                     value={{
 *                         last_seen_gte: startOfWeek(
 *                             new Date()
 *                         ).toISOString(),
 *                         last_seen_lte: undefined,
 *                     }}
 *                 />
 *                 <FilterListItem
 *                     label="Last week"
 *                     value={{
 *                         last_seen_gte: subWeeks(
 *                             startOfWeek(new Date()),
 *                             1
 *                         ).toISOString(),
 *                         last_seen_lte: startOfWeek(
 *                             new Date()
 *                         ).toISOString(),
 *                     }}
 *                 />
 *                 <FilterListItem
 *                     label="This month"
 *                     value={{
 *                         last_seen_gte: startOfMonth(
 *                             new Date()
 *                         ).toISOString(),
 *                         last_seen_lte: undefined,
 *                     }}
 *                 />
 *                 <FilterListItem
 *                     label="Last month"
 *                     value={{
 *                         last_seen_gte: subMonths(
 *                             startOfMonth(new Date()),
 *                             1
 *                         ).toISOString(),
 *                         last_seen_lte: startOfMonth(
 *                             new Date()
 *                         ).toISOString(),
 *                     }}
 *                 />
 *                 <FilterListItem
 *                     label="Earlier"
 *                     value={{
 *                         last_seen_gte: undefined,
 *                         last_seen_lte: subMonths(
 *                             startOfMonth(new Date()),
 *                             1
 *                         ).toISOString(),
 *                     }}
 *                 />
 *             </FilterList>
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterListItem = memo(
    (props: {
        label: string | ReactElement;
        value: any;
        className?: string;
    }) => {
        const { label, value, className } = props;
        const { filterValues, setFilters } = useListFilterContext();
        const translate = useTranslate();

        const isSelected = matches(
            pickBy(value, val => typeof val !== 'undefined')
        )(filterValues);

        const addFilter = () => {
            setFilters({ ...filterValues, ...value }, null, false);
        };

        const removeFilter = () => {
            const keysToRemove = Object.keys(value);
            const filters = Object.keys(filterValues).reduce(
                (acc, key) =>
                    keysToRemove.includes(key)
                        ? acc
                        : { ...acc, [key]: filterValues[key] },
                {}
            );

            setFilters(filters, null, false);
        };

        const toggleFilter = () => (isSelected ? removeFilter() : addFilter());

        return (
            <StyledListItem
                onClick={toggleFilter}
                selected={isSelected}
                className={className}
                disablePadding
            >
                <ListItemButton
                    disableGutters
                    className={FilterListItemClasses.listItemButton}
                >
                    <ListItemText
                        primary={
                            isValidElement(label)
                                ? label
                                : translate(label, { _: label })
                        }
                        className={FilterListItemClasses.listItemText}
                        data-selected={isSelected ? 'true' : 'false'}
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

const PREFIX = 'RaFilterListItem';

export const FilterListItemClasses = {
    listItemButton: `${PREFIX}-listItemButton`,
    listItemText: `${PREFIX}-listItemText`,
};

const StyledListItem = styled(ListItem, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${FilterListItemClasses.listItemButton}`]: {
        paddingRight: '2em',
        paddingLeft: '2em',
    },
    [`& .${FilterListItemClasses.listItemText}`]: {
        margin: 0,
    },
}));
