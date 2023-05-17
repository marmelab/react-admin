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


The filter sidebar is not a form. Therefore, if your users need to enter complex filters, you'll have to recreate a filter form using react-hook-form (see the [Building a custom filter](./FilteringTutorial.md#building-a-custom-filter) section below for an example). However, if you only need one text input with a filter-as-you-type behavior, you'll find the `<FilterLiveSearch>` component convenient.

It outputs a form containing a single `<SearchInput>`, which modifies the page filter on change. That's usually what users expect for a full-text filter. `<FilterLiveSearch>` only needs a `source` field.

So for instance, to add a search filter on the customer full name, add the following line to the Sidebar:

```diff
+import { FilterLiveSearch } from 'react-admin';

const FilterSidebar = () => (
    <Card>
        <CardContent>
+           <FilterLiveSearch source="full_name" />
            <LastVisitedFilter />
            <HasOrderedFilter />
            <HasNewsletterFilter />
            <SegmentFilter />
        </CardContent>
    </Card>
);
```
