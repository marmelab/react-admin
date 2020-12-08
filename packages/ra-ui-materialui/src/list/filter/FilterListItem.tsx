import * as React from 'react';
import { FC, memo } from 'react';
import {
    IconButton,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import { useTranslate, useListFilterContext } from 'ra-core';
import { shallowEqual } from 'react-redux';
import { isEmpty, isMatch, merge, omit } from 'lodash';
import { paths } from 'deepdash-es/standalone';

const useStyles = makeStyles(theme => ({
    listItem: {
        paddingLeft: '2em',
    },
    listItemText: {
        margin: 0,
    },
}));

/**
 * Button to enable/disable a list filter.
 *
 * Expects 2 props:
 *
 * - label: The text to be displayed for this item. Will be translated.
 * - value: An object to be merged into the filter value when enabling the filter
 * (e.g. { is_published: true, published_at_gte: '2020-07-08' })
 *
 * @example
 *
 * import * as React from 'react';
 * import { Card, CardContent } from '@material-ui/core';
 * import MailIcon from '@material-ui/icons/MailOutline';
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
 * import { Card, CardContent } from '@material-ui/core';
 * import AccessTimeIcon from '@material-ui/icons/AccessTime';
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
const FilterListItem: FC<{ label: string; value: any }> = props => {
    const { label, value } = props;
    const { filterValues, setFilters } = useListFilterContext();
    const translate = useTranslate();
    const classes = useStyles(props);

    const isSelected =
        isEmpty(value) || isEmpty(filterValues)
            ? false
            : isMatch(filterValues, value);

    const addFilter = () => {
        setFilters(merge({}, filterValues, value), null, false);
    };

    const removeFilter = () => {
        setFilters(omit(filterValues, paths(value)), null, false);
        const displayedFilterToRemove = Object.keys(
            displayedFilters
        )?.find(elem => paths(value).includes(elem));
        hideFilter(displayedFilterToRemove);
    };

    const toggleFilter = () => (isSelected ? removeFilter() : addFilter());

    return (
        <ListItem
            button
            onClick={toggleFilter}
            selected={isSelected}
            className={classes.listItem}
        >
            <ListItemText
                primary={translate(label, { _: label })}
                className={classes.listItemText}
            />
            {isSelected && (
                <ListItemSecondaryAction>
                    <IconButton size="small" onClick={toggleFilter}>
                        <CancelIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

const arePropsEqual = (prevProps, nextProps) =>
    prevProps.label === nextProps.label &&
    shallowEqual(prevProps.value, nextProps.value);

export default memo(FilterListItem, arePropsEqual);
