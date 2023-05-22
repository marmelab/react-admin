---
layout: default
title: "The SavedQueriesList Component"
---

# `<SavedQueriesList>`

<video controls autoplay playsinline muted loop>
  <source src="./img/SavedQueriesList.webm" type="video/webm"/>
  <source src="./img/SavedQueriesList.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


`<SavedQueriesList>` renders a list of filters saved by the end user (and kept in [the Store](./Store.md)). It is a complement to `<FilterList>` sections for [the filter sidebar](./FilteringTutorial.md#the-filterlist-sidebar).

## Usage

```diff
import {
    FilterList,
    FilterListItem,
    List,
    Datagrid
+   SavedQueriesList
} from 'react-admin';
import { Card, CardContent } from '@mui/material';

const SongFilterSidebar = () => (
    <Card>
        <CardContent>
+           <SavedQueriesList />
            <FilterList label="Record Company" icon={<BusinessIcon />}>
                ...
            </FilterList>
            <FilterList label="Released" icon={<DateRangeeIcon />}>
               ...
            </FilterList>
        </CardContent>
    </Card>
);

const SongList = () => (
    <List aside={<SongFilterSidebar />}>
        <Datagrid>
            ...
        </Datagrid>
    </List>
);
```

`<SavedQueriesList>` accept a single prop:

* [`icon`](#icon)

## `icon`

When set, the `<SavedQueriesList icon>` prop appears on the left side of the filter label.

{% raw %}
```jsx
import { FilterList, FilterListItem, List, Datagrid, SavedQueriesList } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';

const SongFilterSidebar = () => (
    <Card>
        <CardContent>
            <SavedQueriesList icon={<BookmarkIcon />} />
            <FilterList label="Record Company" icon={<BusinessIcon />}>
                ...
            </FilterList>
            <FilterList label="Released" icon={<DateRangeeIcon />}>
               ...
            </FilterList>
        </CardContent>
    </Card>
);

const SongList = () => (
    <List aside={<SongFilterSidebar />}>
        <Datagrid>
            ...
        </Datagrid>
    </List>
);
```
{% endraw %}

