---
layout: default
title: "Filtering the List"
---

# Filtering the List

<table><tbody><tr style="border:none">
<td style="width:50%;border:none;">
<a title="Filter Button/Form Combo" href="./img/list_filter.gif"><img src="./img/list_filter.gif" /></a>
</td>
<td style="width:50%;border:none;">
<a title="<FilterList> Sidebar" href="./img/filter-sidebar.gif"><img src="./img/filter-sidebar.gif" /></a>
</td>
</tr></tbody></table>

One of the most important features of the List page is the ability to filter the results. React-admin does its best to offer a powerful filter functionality, and to get out of the way when you want to go further. 

The next sections explain how to use the filter functionality. And first, a few explanations about the inner workings of filters:

- [Filter Query Parameter](#filter-query-parameter)
- [Linking To A Pre-Filtered List](#linking-to-a-pre-filtered-list)

React-admin proposes several UI components to let users see and modify filters, and gives you the tools to build custom ones.

- The Filter Button/Form Combo
  - [Usage](#the-filter-buttonform-combo)
  - [Full-Text Search](#full-text-search)
  - [Quick Filters](#quick-filters)
- The `<FilterList>` Sidebar
  - [Usage](#the-filterlist-sidebar)
  - [Full-Text Search](#live-search)
- [Saved Queries: Let Users Save Filter And Sort](#saved-queries-let-users-save-filter-and-sort)
- [Building A Custom Filter](#building-a-custom-filter)

## Filter Query Parameter

React-admin uses the `filter` query parameter from the URL to determine the filters to apply to the list. To change the filters, react-admin simply changes this `filter` query parameter, and the `<List>` components fetches `dataProvider.getList()` again with the new filters.

Here is a typical List URL:

> https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at

Once decoded, the `filter` query parameter reveals as a JSON value:

```
filter={"commentable":true,"q":"lorem "}
```

You can change the filters by updating the query parameter, e.g. using the `<Link>` component or the `history.push()` method from `react-router`. 

**Tip**: Once a user sets a filter, react-admin persists the filter value in the application state, so that when the user comes back to the list, they should see the filtered list. That's a design choice.

## Linking To A Pre-Filtered List

As the filter values are taken from the URL, you can link to a pre-filtered list by setting the `filter` query parameter.

For instance, if you have a list of tags, you can display a button for each category to link to the list of posts filtered by that tag:

{% raw %}
```jsx
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const LinkToRelatedProducts = ({ record }) => {
    const translate = useTranslate();
    return record ? (
        <Button
            color="primary"
            component={Link}
            to={{
                pathname: '/posts',
                search: `filter=${JSON.stringify({ category_id: record.id })}`,
            }}
        >
            All posts with the category {record.name} ; 
        </Button>
    ) : null;
};
```
{% endraw %}

You can use this button e.g. as a child of `<Datagrid>`. You can also create a custom Menu button with that technique to link to the unfiltered list by setting the filter value to `{}`.

## The Filter Button/Form Combo

![List Filters](./img/list_filter.gif)

The default appearance for filters is an inline form displayed on top of the list. Users also see a dropdown button allowing to add more inputs to that form. This functionality relies on the `filters` prop: 

```jsx
import { TextInput } from 'react-admin';

const postFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
];
```

Elements of the `filters` array are regular inputs. That means you can build sophisticated filters based on references, array values, etc. `<List>` hides all inputs in the filter form by default, except those that have the `alwaysOn` prop.

**Tip**: For technical reasons, react-admin does not accept Filter inputs having both a `defaultValue` and `alwaysOn`. To set default values for always on filters, use the [`filterDefaultValues`](#filterdefaultvalues) prop of the `<List>` component instead.

To inject the filter form in a `<List>`, use the `filters` prop:

```jsx
export const PostList = (props) => (
    <List {...props} filters={postFilters}>
        ...
    </List>
);
```

`<List>` uses the elements passed as `filters` twice:

- once to render the filter *form*
- once to render the filter *button* (using each element `label`, falling back to the humanized `source`)

### Full-Text Search

![`<SearchInput>`](./img/search_input.gif)

In addition to [the usual input types](./Inputs.md) (`<TextInput>`, `<SelectInput>`, `<ReferenceInput>`, etc.), you can use the `<SearchInput>`, which is designed especially for the filter form. It's like a `<TextInput resettable>` with a magnifier glass icon - exactly the type of input users look for when they want to do a full-text search. 

```jsx
import { SearchInput, TextInput } from 'react-admin';

const postFilters = [
    <SearchInput source="q" alwaysOn />
];
```

In the example given above, the `q` filter triggers a full-text search on all fields. It's your responsibility to implement the full-text filtering capabilities in your `dataProvider`, or in your API.

### Quick Filters

![`<QuickFilter>`](./img/quick_filters.gif)

Users usually dislike using their keyboard to filter a list (especially on mobile). A good way to satisfy this user requirement is to turn filters into *quick filter*. A Quick filter is a filter with a non-editable `defaultValue`. Users can only enable or disable them. 

Here is how to implement a generic `<QuickFilter>` component:

```jsx
import { SearchInput } from 'react-admin';
import { makeStyles, Chip } from '@mui/material';

const useQuickFilterStyles = makeStyles(theme => ({
    chip: {
        marginBottom: theme.spacing(1),
    },
}));
const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    const classes = useQuickFilterStyles();
    return <Chip className={classes.chip} label={translate(label)} />;
};

const postFilters = [
    <SearchInput source="q" alwaysOn />,
    <QuickFilter source="commentable" label="Commentable" defaultValue={true} />,
    <QuickFilter source="views_lte" label="Low views" defaultValue={150} />,
    <QuickFilter source="tags" label="Tagged Code" defaultValue={[3]} />,
];
```

**Tip**: It's currently not possible to use two quick filters for the same source. 

## The `<FilterList>` Sidebar

![Filter Sidebar](./img/filter-sidebar.gif)

An alternative UI to the Filter Button/Form Combo is the FilterList Sidebar. Similar to what users usually see on e-commerce websites, it's a panel with many simple filters that can be enabled and combined using the mouse. The user experience is better than the Button/Form Combo, because the filter values are explicit, and it doesn't require typing anything in a form. But it's a bit less powerful, as only filters with a finite set of values (or intervals) can be used in the `<FilterList>`.

### Basic usage

The `<FilterList>` component expects a list of `<FilterListItem>` as children. Each `<FilterListItem>` defines a filter `label` and a `value`, which is merged with the current filter value when enabled by the user. Here is an example usage for a list of customers:

{% raw %}
```jsx
import * as React from 'react';
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

### Placing Filters In A Sidebar

You can place these `<FilterList>` anywhere inside a `<List>`. The most common case is to put them in a sidebar that is on the left-hand side of the `Datagrid`. You can use the `aside` property for that:

```jsx
import * as React from 'react';
import { Card as MuiCard, CardContent, withStyles } from '@mui/material';

import { LastVisitedFilter, HasOrderedFilter, HasNewsletterFilter, SegmentFilter } from './filters';

const Card = withStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            order: -1, // display on the left rather than on the right of the list
            width: '15em',
            marginRight: '1em',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}))(MuiCard);

const FilterSidebar = () => (
    <Card>
        <CardContent>
            <LastVisitedFilter />
            <HasOrderedFilter />
            <HasNewsletterFilter />
            <SegmentFilter />
        </CardContent>
    </Card>
);

const CustomerList = props => (
    <List aside={<FilterSidebar />}>
        // ...
    </List>
)
```

**Tip**: The `<FilterList>` Sidebar is not a good UI for small screens. You can choose to hide it on small screens (as in the previous example). A good tradeoff is to use `<FilterList>` on large screens, and the Filter Button/Form combo on Mobile.

### Live Search

![Filter Live Search](./img/filter-live-search.gif)

The filter sidebar is not a form. Therefore, if your users need to enter complex filters, you'll have to recreate a filter form using react-final-form (see the [Building a custom filter](#building-a-custom-filter) section below for an example). However, if you only need one text input with a filter-as-you-type behavior, you'll find the `<FilterLiveSearch>` component convenient. 

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

## Saved Queries: Let Users Save Filter And Sort

[![Saved Queries in FilterList](https://marmelab.com/ra-enterprise/modules/assets/ra-preferences-SavedQueriesList.gif)](https://marmelab.com/ra-enterprise/modules/assets/ra-preferences-SavedQueriesList.gif)

Saved Queries are an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> feature letting users save a combination of filters and sort parameters into a new, personal filter. Saved queries persist between sessions, so users can find their custom queries even after closing and reopening the admin. Saved queries are available both for the Filter Button/Form combo and for the `<FilterList>` Sidebar:

- `<FilterWithSave>` is a drop-in replacement for react-admin's `<Filter>` component

```diff
import {
-   Filter,
    SelectInput,
    DateInput,
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField
} from 'react-admin';
+import { FilterWithSave } from '@react-admin/ra-preferences';

const SongFilter = props => (
-   <Filter {...props}>
+   <FilterWithSave {...props}>
        <SelectInput
            choices={[
                { id: 'Apple', name: 'Apple' },
                { id: 'Atlantic', name: 'Atlantic' },
                { id: 'Capitol', name: 'Capitol' },
                { id: 'Chess', name: 'Chess' },
                { id: 'Columbia', name: 'Columbia' },
                { id: 'DGC', name: 'DGC' },
                { id: 'London', name: 'London' },
                { id: 'Tamla', name: 'Tamla' },
            ]}
            source="recordCompany"
        />
        <DateInput source="released_gte" label="Released after" />
        <DateInput source="released_lte" label="Released before" />
-   </Filter>
+   </FilterWithSave>
);

const SongList = props => (
    <List {...props} filters={<SongFilter />}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="artist" />
            <TextField source="writer" />
            <TextField source="producer" />
            <TextField source="recordCompany" />
            <NumberField source="rank" />
            <DateField source="released" />
        </Datagrid>
    </List>
);
```

- `<SavedFilterList>` is a complement to `<FilterList>` sections for the filter sidebar

```diff
import { FilterList, FilterListItem, List, Datagrid } from 'react-admin';
import { Card, CardContent } from '@mui/material';

+import { SavedQueriesList } from '@react-admin/ra-preferences';

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

const SongList = props => (
    <List {...props} aside={<SongFilterSidebar />}>
        <Datagrid>
            ...
        </Datagrid>
    </List>
);
```

For mode details about Saved Queries, check the [`ra-preferences` module](https://marmelab.com/ra-enterprise/modules/ra-preferences#savedquerieslist-and-filterwithsave-store-user-queries-in-preferences) in React-Admin Enterprise Edition. 

## Building a Custom Filter

![Filters with submit button](./img/filter_with_submit.gif)

If neither the Filter button/form combo nor the `<FilterList>` sidebar match your need, you can always build your own. React-admin provides shortcuts to facilitate the development of custom filters.

For instance, by default, the filter button/form combo doesn't provide a submit button, and submits automatically after the user has finished interacting with the form. This provides a smooth user experience, but for some APIs, it can cause too many calls. 

In that case, the solution is to process the filter when users click on a submit button, rather than when they type values in form inputs. React-admin doesn't provide any component for that, but it's a good opportunity to illustrate the internals of the filter functionality. We'll actually provide an alternative implementation to the Filter button/form combo.

To create a custom filter UI, we'll have to override the default List Actions component, which will contain both a Filter Button and a Filter Form, interacting with the List filters via the ListContext.

### Filter Callbacks

The new element can use the `useListContext()` hook to interact with the URI query parameter more easily. The hook returns the following constants:

- `filterValues`: Value of the filters based on the URI, e.g. `{"commentable":true,"q":"lorem "}`
- `setFilters()`: Callback to set the filter values, e.g. `setFilters({"commentable":true})`
- `displayedFilters`: Names of the filters displayed in the form, e.g. `['commentable','title']`
- `showFilter()`: Callback to display an additional filter in the form, e.g. `showFilter('views')`
- `hideFilter()`: Callback to hide a filter in the form, e.g. `hideFilter('title')`

Let's use this knowledge to write a custom `<List>` component that filters on submit.

### Custom Filter Button

The `<PostFilterButton>` shows the filter form on click. We'll take advantage of the `showFilter` function:

```jsx
import { useListContext } from 'react-admin';
import { Button } from "@mui/material";
import ContentFilter from "@mui/icons-material/FilterList";

const PostFilterButton = () => {
    const { showFilter } = useListContext();
    return (
        <Button
            size="small"
            color="primary"
            onClick={() => showFilter("main")}
            startIcon={<ContentFilter />}
        >
            Filter
        </Button>
    );
};
```

Normally, `showFilter()` adds one input to the `displayedFilters` list. As the filter form will be entirely hidden or shown, we use `showFilter()` with a virtual "main" input, which represents the entire form. 

### Custom Filter Form

Next is the filter form component, displayed only when the "main" filter is displayed (i.e. when a user has clicked the filter button). The form inputs appear directly in the form, and the form submission triggers the `setFilters()` callback passed as parameter. We'll use `react-final-form` to handle the form state:

{% raw %}
```jsx
import * as React from 'react';
import { Form } from 'react-final-form';
import { Box, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput, NullableBooleanInput, useListContext } from 'react-admin';

const PostFilterForm = () => {
  const {
    displayedFilters,
    filterValues,
    setFilters,
    hideFilter
  } = useListContext();

  if (!displayedFilters.main) return null;

  const onSubmit = (values) => {
    if (Object.keys(values).length > 0) {
      setFilters(values);
    } else {
      hideFilter("main");
    }
  };

  const resetFilter = () => {
    setFilters({}, []);
  };

  return (
    <div>
      <Form onSubmit={onSubmit} initialValues={filterValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="flex-end" mb={1}>
              <Box component="span" mr={2}>
                {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                <TextInput
                  resettable
                  helperText={false}
                  source="q"
                  label="Search"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <SearchIcon color="disabled" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box component="span" mr={2}>
                {/* Commentable filter */}
                <NullableBooleanInput helperText={false} source="commentable" />
              </Box>
              <Box component="span" mr={2} mb={1.5}>
                <Button variant="outlined" color="primary" type="submit">
                  Filter
                </Button>
              </Box>
              <Box component="span" mb={1.5}>
                <Button variant="outlined" onClick={resetFilter}>
                  Close
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Form>
    </div>
  );
};
```
{% endraw %}

### Using The Custom Filters in The List Actions

To finish, create a `<ListAction>` component and pass it to the `<List>` component using the `actions` prop:

```jsx
import { TopToolbar, ExportButton } from 'react-admin';
import { Box } from '@mui/material';

const ListActions = () => (
  <Box width="100%">
    <TopToolbar>
      <PostFilterButton />
      <ExportButton />
    </TopToolbar>
    <PostFilterForm />
  </Box>
);

export const PostList = (props) => (
    <List {...props} actions={<ListActions />}>
        ...
    </List>
);
```

**Tip**: No need to pass any `filters` to the list anymore, as the `<PostFilterForm>` component will display them.

You can use a similar approach to offer alternative User Experiences for data filtering, e.g. to display the filters as a line in the datagrid headers.

## Global Search

Although list filters allow to make precise queries using per-field criteria, users often prefer simpler interfaces like full-text search. After all, that's what they use every day on search engines, email clients, and in their file explorer. 

If you want to display a full-text search allowing to look for any record in the admin using a single form input, check out [ra-search](https://marmelab.com/ra-enterprise/modules/ra-search), an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> module.

![ra-search basic](https://marmelab.com/ra-enterprise/modules/assets/ra-search-overview.gif)

`ra-search` can plug to any existing search engine (ElasticSearch, Lucene, or custom search engine), and lets you customize the search results to provide quick navigation to related items, turning the search engine into an "Omnibox": 

![ra-search demo](https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.gif)

For mode details about the global search, check the [`ra-search` module](https://marmelab.com/ra-enterprise/modules/ra-search) in React-Admin Enterprise Edition. 
