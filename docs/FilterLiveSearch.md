---
layout: default
title: "The FilterLiveSearch Component"
---

# `<FilterLiveSearch>`

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-live-search.webm" type="video/webm"/>
  <source src="./img/filter-live-search.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The filter sidebar is not a form. Therefore, if your users need to enter complex filters, you'll have to recreate a filter form using react-hook-form (see the [Building a custom filter](./FilteringTutorial.md#building-a-custom-filter) for an example). However, if you only need one text input with a filter-as-you-type behavior, you'll find the `<FilterLiveSearch>` component convenient.

It outputs a form containing a single `<TextInput>`, which modifies the page filter on change. That's usually what users expect for a full-text filter.

## Usage

To add a full-text search filter on customers, include `<FilterLiveSearch>` in a sidebar component, then use that component in the `<List>` component's `aside` prop:

{% raw %}
```tsx
import { List, FilterLiveSearch } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import { LastVisitedFilter, HasOrderedFilter, HasNewsletterFilter, SegmentFilter } from './filters';

const FilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
        <CardContent>
            <FilterLiveSearch source="q" label="Search" />
            <LastVisitedFilter />
            <HasOrderedFilter />
            <HasNewsletterFilter />
            <SegmentFilter />
        </CardContent>
    </Card>
);

export const CustomerList = () => (
    <List aside={<FilterSidebar />}>
        ...
    </List>
);
```
{% endraw %}

## Props

| Prop | Required | Type | Default | Description |
|------|----------|------|---------|-------------|
| `hiddenLabel` | Optional | `boolean` | `false` | If true, use the label as a placeholder. |
| `label` | Optional | `string` | 'ra.action.search' | The label of the search input. |
| `source` | Optional | `string` | 'q' | The field to filter on. |
| `variant` | Optional | `string` | 'standard' | The variant of the search input. Can be one of 'standard', 'outlined', or 'filled'. |

Additional props are passed down to [the Material UI `<TextField>` component](https://mui.com/material-ui/api/text-field/).