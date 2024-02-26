import * as React from 'react';
import { isElement } from 'react-is';
import { styled } from '@mui/material/styles';
import { memo, ReactElement } from 'react';
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemProps,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import {
    useTranslate,
    useListFilterContext,
    shallowEqual,
    useEvent,
} from 'ra-core';
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
export const FilterListItem = memo((props: FilterListItemProps) => {
    const {
        label,
        value,
        icon,
        isSelected: getIsSelected = DefaultIsSelected,
        toggleFilter: userToggleFilter = DefaultToggleFilter,
        ...rest
    } = props;
    const { filterValues, setFilters } = useListFilterContext();
    const translate = useTranslate();
    const toggleFilter = useEvent(userToggleFilter);

    // We can't wrap this function with useEvent as it is called in the render phase
    const isSelected = getIsSelected(value, filterValues);

    const handleClick = () => setFilters(toggleFilter(value, filterValues));

    return (
        <StyledListItem
            onClick={handleClick}
            selected={isSelected}
            disablePadding
            {...rest}
        >
            <ListItemButton
                disableGutters
                className={FilterListItemClasses.listItemButton}
            >
                {icon && (
                    <ListItemIcon
                        className={FilterListItemClasses.listItemIcon}
                    >
                        {icon}
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={
                        typeof label === 'string' && !isElement(label)
                            ? translate(label, { _: label })
                            : label
                    }
                    className={FilterListItemClasses.listItemText}
                    data-selected={isSelected ? 'true' : 'false'}
                />
                {isSelected && (
                    <ListItemSecondaryAction
                        onClick={event => {
                            event.stopPropagation();
                            handleClick();
                        }}
                    >
                        <IconButton size="small">
                            <CancelIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItemButton>
        </StyledListItem>
    );
}, arePropsEqual);

const DefaultIsSelected = (value, filters) =>
    matches(pickBy(value, val => typeof val !== 'undefined'))(filters);

const DefaultToggleFilter = (value, filters) => {
    const isSelected = matches(
        pickBy(value, val => typeof val !== 'undefined')
    )(filters);

    if (isSelected) {
        const keysToRemove = Object.keys(value);
        return Object.keys(filters).reduce(
            (acc, key) =>
                keysToRemove.includes(key)
                    ? acc
                    : { ...acc, [key]: filters[key] },
            {}
        );
    }

    return { ...filters, ...value };
};

const PREFIX = 'RaFilterListItem';

export const FilterListItemClasses = {
    listItemButton: `${PREFIX}-listItemButton`,
    listItemText: `${PREFIX}-listItemText`,
    listItemIcon: `${PREFIX}-listItemIcon`,
};

const StyledListItem = styled(ListItem, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${FilterListItemClasses.listItemButton}`]: {
        paddingRight: '2em',
        paddingLeft: '2em',
    },
    [`& .${FilterListItemClasses.listItemText}`]: {
        margin: 0,
    },
    [`& .${FilterListItemClasses.listItemIcon}`]: {
        minWidth: 0,
        marginRight: '0.5em',
    },
});

export interface FilterListItemProps extends Omit<ListItemProps, 'value'> {
    label: string | ReactElement;
    value: any;
    icon?: ReactElement;
    toggleFilter?: (value: any, filters: any) => any;
    isSelected?: (value: any, filters: any) => boolean;
}
