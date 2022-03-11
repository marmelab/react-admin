---
layout: default
title: "The FilterList Component"
---

# `<FilterList>`

![Filter Sidebar](./img/filter-sidebar.gif)

An alternative UI to the Filter Button/Form Combo is the FilterList Sidebar. Similar to what users usually see on e-commerce websites, it's a panel with many simple filters that can be enabled and combined using the mouse. The user experience is better than the Button/Form Combo, because the filter values are explicit, and it doesn't require typing anything in a form. But it's a bit less powerful, as only filters with a finite set of values (or intervals) can be used in the `<FilterList>`.

## Usage

The `<FilterList>` component expects a list of `<FilterListItem>` as children. Each `<FilterListItem>` defines a filter `label` and a `value`, which is merged with the current filter value when enabled by the user. Here is an example usage for a list of customers:

{% raw %}
```jsx
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import MailIcon from '@mui/icons-material/MailOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import { FilterList, FilterListItem } from 'react-admin';
import {
    endOfYesterday,
    startOfWeek,
    subWeeks,
    startOfMonth,
    subMonths,
} from 'date-fns';

import segments from '../segments/data';

const LastVisitedFilter = () => (
    <FilterList label="Last visited" icon={<AccessTimeIcon />}>
        <FilterListItem
            label="Today"
            value={{
                last_seen_gte: endOfYesterday().toISOString(),
                last_seen_lte: undefined,
            }}
        />
        <FilterListItem
            label="This week"
            value={{
                last_seen_gte: startOfWeek(new Date()).toISOString(),
                last_seen_lte: undefined,
            }}
        />
        <FilterListItem
            label="Last week"
            value={{
                last_seen_gte: subWeeks(startOfWeek(new Date()), 1).toISOString(),
                last_seen_lte: startOfWeek(new Date()).toISOString(),
            }}
        />
        <FilterListItem
            label="This month"
            value={{
                last_seen_gte: startOfMonth(new Date()).toISOString(),
                last_seen_lte: undefined,
            }}
        />
        <FilterListItem
            label="Last month"
            value={{
                last_seen_gte: subMonths(startOfMonth(new Date()),1).toISOString(),
                last_seen_lte: startOfMonth(new Date()).toISOString(),
            }}
        />
        <FilterListItem
            label="Earlier"
            value={{
                last_seen_gte: undefined,
                last_seen_lte: subMonths(startOfMonth(new Date()),1).toISOString(),
            }}
        />
    </FilterList>
);
const HasOrderedFilter = () => (
    <FilterList
        label="Has ordered"
        icon={<MonetizationOnIcon />}
    >
        <FilterListItem
            label="True"
            value={{
                nb_commands_gte: 1,
                nb_commands_lte: undefined,
            }}
        />
        <FilterListItem
            label="False"
            value={{
                nb_commands_gte: undefined,
                nb_commands_lte: 0,
            }}
        />
    </FilterList>
);
const HasNewsletterFilter = () => (
    <FilterList
        label="Has newsletter"
        icon={<MailIcon />}
    >
        <FilterListItem
            label="True"
            value={{ has_newsletter: true }}
        />
        <FilterListItem
            label="False"
            value={{ has_newsletter: false }}
        />
    </FilterList>
);
const SegmentFilter = () => (
    <FilterList
        label="Segment"
        icon={<LocalOfferIcon />}
    >
        {segments.map(segment => (
            <FilterListItem
                label={segment.name}
                key={segment.id}
                value={{ groups: segment.id }}
            />
        ))}
    </FilterList>
);
```
{% endraw %}

`<FilterList>` accepts 3 props:

* [`children`](#children), which must be a list of `<FilterListItem>`
* [`icon`](#icon)
* [`label`](#label)

## `children`

The children of `<FilterList>` must be a list of `<FilterListItem>` components. Each `<FilterListItem>` defines a filter `label` and a `value`, which is merged with the current filter value when enabled by the user.

{% raw %}
```jsx
import { FilterList, FilterListItem } from 'react-admin';

const HasNewsletterFilter = () => (
    <FilterList label="Has newsletter">
        <FilterListItem
            label="True"
            value={{ has_newsletter: true }}
        />
        <FilterListItem
            label="False"
            value={{ has_newsletter: false }}
        />
    </FilterList>
);
```
{% endraw %}

## `icon`

When set, the `<FilterList icon>` prop appears on the left side of the filter label.

{% raw %}
```jsx
import { FilterList, FilterListItem } from 'react-admin';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';

const HasOrderedFilter = () => (
    <FilterList
        label="Has ordered"
        icon={<MonetizationOnIcon />}
    >
        <FilterListItem
            label="True"
            value={{ nb_commands_gte: 1, nb_commands_lte: undefined }}
        />
        <FilterListItem
            label="False"
            value={{ nb_commands_gte: undefined, nb_commands_lte: 0 }}
        />
    </FilterList>
);
```
{% endraw %}

## `label`

React-admin renders the `<FilterList label>` on top of the child filter items. The string is passed through the `useTranslate` hook, and therefore can be translated.

{% raw %}
```jsx
import { FilterList, FilterListItem } from 'react-admin';

const HasOrderedFilter = () => (
    <FilterList label="Has ordered">
        <FilterListItem
            label="True"
            value={{ nb_commands_gte: 1, nb_commands_lte: undefined }}
        />
        <FilterListItem
            label="False"
            value={{ nb_commands_gte: undefined, nb_commands_lte: 0 }}
        />
    </FilterList>
);
```
{% endraw %}

## Placing Filters In A Sidebar

You can place these `<FilterList>` anywhere inside a `<List>`. The most common case is to put them in a sidebar that is on the left-hand side of the `Datagrid`. You can use the `aside` property for that:

```jsx
import * as React from 'react';
import { Box, Card, CardContent, styled } from '@mui/material';

import { LastVisitedFilter, HasOrderedFilter, HasNewsletterFilter, SegmentFilter } from './filters';

const FilterSidebar = () => (
    <Box
        sx={{
            display: {
                xs: 'none',
                sm: 'block'
            },
            order: -1, // display on the left rather than on the right of the list
            width: '15em',
                marginRight: '1em',
        }}
    >
        <Card>
            <CardContent>
                <LastVisitedFilter />
                <HasOrderedFilter />
                <HasNewsletterFilter />
                <SegmentFilter />
            </CardContent>
        </Card>
    </Box>
);

const CustomerList = props => (
    <List aside={<FilterSidebar />}>
        // ...
    </List>
)
```

**Tip**: The `<FilterList>` Sidebar is not a good UI for small screens. You can choose to hide it on small screens (as in the previous example). A good tradeoff is to use `<FilterList>` on large screens, and the Filter Button/Form combo on Mobile.
