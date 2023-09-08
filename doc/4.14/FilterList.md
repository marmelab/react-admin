---
layout: default
title: "The FilterList Component"
---

# `<FilterList>`

An alternative UI to the Filter Button/Form Combo is the FilterList Sidebar. Similar to what users usually see on e-commerce websites, it's a panel with many simple filters that can be enabled and combined using the mouse.

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-sidebar.webm" type="video/webm"/>
  <source src="./img/filter-sidebar.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The user experience is better than the Button/Form Combo, because the filter values are explicit, and it doesn't require typing anything in a form. But it's a bit less powerful, as only filters with a finite set of values (or intervals) can be used in the `<FilterList>`.

## Usage

Use the `<FilterList>` component in a sidebar for the `<List>` view. It expects a list of `<FilterListItem>` as children. Each `<FilterListItem>` defines a filter `label` and a `value`, which is merged with the current filter value when enabled by the user. 

For instance, here is a filter sidebar for a post list, allowing users to filter on two fields:

{% raw %}
```jsx
import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/LocalOffer';

export const PostFilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="Subscribed to newsletter" icon={<MailIcon />}>
                <FilterListItem label="Yes" value={{ has_newsletter: true }} />
                <FilterListItem label="No" value={{ has_newsletter: false }} />
            </FilterList>
            <FilterList label="Category" icon={<CategoryIcon />}>
                <FilterListItem label="Tests" value={{ category: 'tests' }} />
                <FilterListItem label="News" value={{ category: 'news' }} />
                <FilterListItem label="Deals" value={{ category: 'deals' }} />
                <FilterListItem label="Tutorials" value={{ category: 'tutorials' }} />
            </FilterList>
        </CardContent>
    </Card>
);
```
{% endraw %}

Add this component to the list view using [the `<List aside>` prop](./List.md#aside):

```jsx
import { PostFilterSidebar } from './PostFilterSidebar';

export const PostList = () => (
    <List aside={<PostFilterSidebar />}>
        ...
    </List>
);
```

**Tip**: The `<Card sx>` prop in the `PostFilterSidebar` component above is here to put the sidebar on the left side of the screen, instead of the default right side.

A more sophisticated example is the filter sidebar for the visitors list visible in the screencast at the beginning of this page. The code for this example is available in the [react-admin repository](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/visitors/VisitorListAside.tsx).

**Tip**: In a Filter List sidebar, you can use [the `<FilterLiveSearch>` component](./FilterLiveSearch.md) to add a search input at the top of the sidebar, and [the `<SavedQueriesList>` component](./SavedQueriesList.md) to add a list of saved queries.

## Props

`<FilterList>` accepts 3 props:

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| [`children`](#children) | Required | node | | The children of `<FilterList>` must be a list of `<FilterListItem>` components. |
| [`icon`](#icon) | Optional | element | | When set, the `<FilterList icon>` prop appears on the left side of the filter label. |
| [`label`](#label) | Optional | string | | React-admin renders the `<FilterList label>` on top of the child filter items. The string is passed through the `useTranslate` hook, and therefore can be translated. |

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

{% raw %}
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
{% endraw %}

**Tip**: The `<FilterList>` Sidebar is not a good UI for small screens. You can choose to hide it on small screens (as in the previous example). A good tradeoff is to use `<FilterList>` on large screens, and the Filter Button/Form combo on Mobile.

## Cumulative Filters

By default, selecting a filter item replaces the current filter value. But for some filter types, like categories, you may want to allow users to select more than one item. 

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-list-cumulative.webm" type="video/webm"/>
  <source src="./img/filter-list-cumulative.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

To do so, you can use the `isSelected` and `toggleFilter` props of the `<FilterListItem>` component.

- The `isSelected` prop accepts a function that receives the item value and the currently applied filters. It must return a boolean.
- The `toggleFilter` prop accepts a function that receives the item value and the currently applied filters. It is called when user toggles a filter and must return the new filters to apply.

Here's how you could implement cumulative filters, e.g. allowing users to filter items having one of several categories:

{% raw %}
```jsx
import { FilterList, FilterListItem } from 'react-admin';
import CategoryIcon from '@mui/icons-material/LocalOffer';

export const CategoriesFilter = () => {
    const isSelected = (value, filters) => {
        const categories = filters.categories || [];
        return categories.includes(value.category);
    };

    const toggleFilter = (value, filters) => {
        const categories = filters.categories || [];
        return {
            ...filters,
            categories: categories.includes(value.category)
                // Remove the category if it was already present
                ? categories.filter(v => v !== value.category)
                // Add the category if it wasn't already present
                : [...categories, value.category],
        };
    };

    return (
        <FilterList label="Categories" icon={<CategoryIcon />}>
            <FilterListItem
                label="Tests"
                value={{ category: 'tests' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="News"
                value={{ category: 'news' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Deals"
                value={{ category: 'deals' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
            <FilterListItem
                label="Tutorials"
                value={{ category: 'tutorials' }}
                isSelected={isSelected}
                toggleFilter={toggleFilter}
            />
        </FilterList>
    )
}
```
{% endraw %}

## `<FilterListItem>`

The children of `<FilterList>` must be a list of `<FilterListItem>` components. The `<FilterListItem>` accepts the following props:

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `label` | Required | string | | The label of the filter item. It is passed through the `useTranslate` hook, and therefore can be translated. |
| `value` | Required | object | | The value of the filter item. It is merged with the current filter value when enabled by the user. |
| `icon` | Optional | `ReactElement` | | When set, the icon appears to the left of the item label.  |
| `isSelected` | Optional | function | | A function that receives the item value and the currently applied filters. It must return a boolean. |
| `toggleFilter` | Optional | function | | A function that receives the item value and the currently applied filters. It is called when user toggles a filter and must return the new filters to apply. |

