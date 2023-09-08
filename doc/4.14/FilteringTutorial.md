---
layout: default
title: "Filtering the List"
---

# Filtering the List

One of the most important features of the List page is the ability to filter the results. React-admin offers powerful filter components, and gets out of the way when you want to go further. 

## Overview

<table><tbody>
<tr style="border:none">
    <td style="width:50%;border:none;text-align:center">
        <a title="Filter Button/Form Combo" href="./img/list_filter.webm">
            <video controls autoplay playsinline muted loop>
                <source src="./img/list_filter.webm" type="video/webm"/>
                <source src="./img/list_filter.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </a>
        <a href="#the-filter-buttonform-combo" style="display: block;transform: translateY(-10px);">The Filter Button/Form Combo</a>
    </td>
    <td style="width:50%;border:none;text-align:center">
        <a title="<FilterList> Sidebar" href="./img/filter-sidebar.webm">
            <video controls autoplay playsinline muted loop>
                <source src="./img/filter-sidebar.webm" type="video/webm"/>
                <source src="./img/filter-sidebar.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </a>
        <a href="#the-filterlist-sidebar" style="display: block;transform: translateY(-10px);">The <code>&lt;FilterList&gt;</code> Sidebar</a>
    </td>
</tr>
<tr style="border:none;background-color:#fff;">
    <td style="width:50%;border:none;text-align:center">
        <a title="Stacked Filters" href="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.webm">
            <video controls autoplay playsinline muted loop width="90%" style="margin:1rem;box-shadow:0px 4px 4px 0px rgb(0 0 0 / 24%);">
                <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.webm" type="video/mp4" />
                    Your browser does not support the video tag.
            </video>
        </a>
        <a href="#the-stackedfilters-component" style="display: block;transform: translateY(-10px);">The <code>&lt;StackedFilters&gt;</code> Dialog</a>
    </td>
    <td style="width:50%;border:none;text-align:center;vertical-align:top;">
        <a title="<Search> input" href="https://marmelab.com/ra-enterprise/modules/assets/ra-search-overview.gif"><img src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-overview.gif" /></a>
        <a href="#global-search" style="display: block;transform: translateY(-10px);">The Global <code>&lt;Search&gt;</code></a>
    </td>
</tr>
</tbody></table>

React-admin offers 4 different ways to filter the list. Depending on the type of data you're displaying, the type and number of filters you have to display, and the device your users are using, you may want to use one or the other.

## The Filter Button/Form Combo

<video controls autoplay playsinline muted loop>
  <source src="./img/list_filter.webm" type="video/webm"/>
  <source src="./img/list_filter.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The default appearance for filters is an inline form displayed on top of the list. Users also see a dropdown button allowing to add more inputs to that form. This functionality relies on the `<List filters>` prop: 

```jsx
import { TextInput } from 'react-admin';

const postFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
];

export const PostList = () => (
    <List filters={postFilters}>
        ...
    </List>
);
```

Elements passed as `filters` are regular inputs. That means you can build sophisticated filters based on references, array values, etc. `<List>` hides all inputs in the [`Filter Form`](./FilterForm.md) by default, except those that have the `alwaysOn` prop.

**Tip**: For technical reasons, react-admin does not accept Filter inputs having both a `defaultValue` and `alwaysOn`. To set default values for always on filters, use the [`filterDefaultValues`](./List.md#filterdefaultvalues) prop of the `<List>` component instead.

`<List>` uses the elements passed as `filters` twice:

- once to render the filter *form* 
- once to render the filter *button* (using each element `label`, falling back to the humanized `source`)

### `<SearchInput>`

<video controls autoplay playsinline muted loop>
  <source src="./img/search_input.webm" type="video/webm"/>
  <source src="./img/search_input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


In addition to [the usual input types](./Inputs.md) (`<TextInput>`, `<SelectInput>`, `<ReferenceInput>`, etc.), you can use the `<SearchInput>` in the `filters` array. This input is designed especially for the [`Filter Form`](./FilterForm.md). It's like a `<TextInput resettable>` with a magnifier glass icon - exactly the type of input users look for when they want to do a full-text search. 

```jsx
import { SearchInput, TextInput } from 'react-admin';

const postFilters = [
    <SearchInput source="q" alwaysOn />
];
```

In the example given above, the `q` filter triggers a full-text search on all fields. It's your responsibility to implement the full-text filtering capabilities in your `dataProvider`, or in your API.

### Quick Filters

<video controls autoplay playsinline muted loop>
  <source src="./img/quick_filters.webm" type="video/webm"/>
  <source src="./img/quick_filters.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Users usually dislike using their keyboard to filter a list (especially on mobile). A good way to satisfy this user requirement is to turn filters into *quick filter*. A Quick filter is a filter with a non-editable `defaultValue`. Users can only enable or disable them. 

Here is how to implement a generic `<QuickFilter>` component:

{% raw %}
```jsx
import { SearchInput } from 'react-admin';
import { Chip } from '@mui/material';

const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const postFilters = [
    <SearchInput source="q" alwaysOn />,
    <QuickFilter source="commentable" label="Commentable" defaultValue={true} />,
    <QuickFilter source="views_lte" label="Low views" defaultValue={150} />,
    <QuickFilter source="tags" label="Tagged Code" defaultValue={[3]} />,
];
```
{% endraw %}

**Tip**: It's currently not possible to use two quick filters for the same source. 

## The `<FilterList>` Sidebar

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-sidebar.webm" type="video/webm"/>
  <source src="./img/filter-sidebar.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


An alternative UI to the Filter Button/Form Combo is the FilterList Sidebar. Similar to what users usually see on e-commerce websites, it's a panel with many simple filters that can be enabled and combined using the mouse. The user experience is better than the Button/Form Combo, because the filter values are explicit, and it doesn't require typing anything in a form. But it's a bit less powerful, as only filters with a finite set of values (or intervals) can be used in the `<FilterList>`.

Here is an example FilterList sidebar:

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

Add it to the list view using the `<List aside>` prop:

```jsx
import { PostFilterSidebar } from './PostFilterSidebar';

export const PostList = () => (
    <List aside={<PostFilterSidebar />}>
        ...
    </List>
);
```

**Tip**: The `<Card sx>` prop in the `PostFilterSidebar` component above is here to put the sidebar on the left side of the screen, instead of the default right side.

Check [the `<FilterList>` documentation](./FilterList.md) for more information.

If you use the FilterList, you'll probably need a search input. As the FilterList sidebar is not a form, this requires a bit of extra work. Fortunately, react-admin provides a specialized search input component for that purpose: check [the `<FilterLiveSearch>` documentation](./FilterLiveSearch.md) for details.

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-live-search.webm" type="video/webm"/>
  <source src="./img/filter-live-search.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Finally, a filter sidebar is the ideal place to display the user's favorite filters. Check [the `<SavedQueriesList>` documentation](./SavedQueriesList.md) for more information.

<video controls autoplay playsinline muted loop>
  <source src="./img/SavedQueriesList.webm" type="video/webm"/>
  <source src="./img/SavedQueriesList.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## The `<StackedFilters>` Component

<video controls autoplay playsinline muted loop width="100%">
    <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.webm" type="video/mp4" />
        Your browser does not support the video tag.
</video>

Another alternative filter UI is the Stacked Filters dialog, an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> exclusive. It lets users build complex filters by combining a field, an operator, and a value. It's more powerful than the Filter Button/Form Combo, but requires more setup on the data provider.

Here is an example StackedFilters configuration:

```jsx
import { 
    List,
    Datagrid,
    TextField,
    NumberField,
    ReferenceArrayField,
    BooleanField,
} from 'react-admin';
import {
    textFilter,
    dateFilter,
    booleanFilter,
    referenceFilter,
    StackedFilters,
} from '@react-admin/ra-form-layout';

const postListFilters = {
    id: textFilter({ operators: ['eq', 'neq'] }),
    title: textFilter(),
    published_at: dateFilter(),
    is_public: booleanFilter(),
    tags: referenceFilter({ reference: 'tags' }),
};

const PostList = () => (
    <List filters={<StackedFilters config={postListFilters} />}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <ReferenceArrayField tags="tags" source="tag_ids" />
            <BooleanField source="published" />
        </Datagrid>
    </List>
)
```

Check the [`<StackedFilters>` documentation](./StackedFilters.md) for more information.

## Global Search

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-overview.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Although list filters allow to make precise queries using per-field criteria, users often prefer simpler interfaces like full-text search. After all, that's what they use every day on search engines, email clients, and in their file explorer. 

If you want to display a full-text search allowing to look for any record in the admin using a single form input, check out [the `<Search>` component](./Search.md), an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> exclusive.

`<Search>` can plug to any existing search engine (ElasticSearch, Lucene, or custom search engine), and lets you customize the search results to provide quick navigation to related items, turning the search engine into an "Omnibox": 

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

For mode details about the global search, check the [`<Search>` documentation](./Search.md). 

## Filter Query Parameter

React-admin uses the `filter` query parameter from the URL to determine the filters to apply to the list. 

Here is a typical List page URL in a react-admin application:

> https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at

Once decoded, the `filter` query parameter reveals as a JSON value:

```
filter={"commentable":true,"q":"lorem "}
```

This leads to the following data provider call:

```js
dataProvider.getList('posts', {
    filter: { commentable: true, q: 'lorem ' },
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'published_at', order: 'DESC' },
});
```

When a user adds or remove a filter, react-admin changes the `filter` query parameter in the URL, and the `<List>` components fetches `dataProvider.getList()` again with the new filters.

**Tip**: Once a user sets a filter, react-admin persists the filter value in the application state, so that when the user comes back to the list, they should see the filtered list. That's a design choice.

**Tip**: You can change the filters programmatically by updating the query parameter, e.g. using the `<Link>` component or the `useNavigate()` hook from `react-router-dom`. 

## Linking To A Pre-Filtered List

As the filter values are taken from the URL, you can link to a pre-filtered list by setting the `filter` query parameter.

For instance, if you have a list of tags, you can display a button for each category to link to the list of posts filtered by that tag:

{% raw %}
```jsx
import { useTranslate, useRecordContext } from 'react-admin';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const LinkToRelatedProducts = () => {
    const record = useRecordContext();
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

## Filter Operators

The internal format for storing filters and sending them to the dataProvider is an object, e.g.:

```js
{ commentable: true, q: "lorem " }
```

This is fine for equality filters, but how can you do more complex filters, like "between", "contains", "starts with", "greater than", etc.?

As there is no standard way to pass such complex filters to APIs, react-admin makes no decision about it. It's up to you to decide how to store them in the filter object.

The demos show one possible way: suffix the filter name with an operator, e.g. "_gte" for "greater than or equal to".

```jsx
const postFilters = [
    <DateInput source="released_gte" label="Released after" />,
    <DateInput source="released_lte" label="Released before" />
];
```

Some API backends (e.g. JSON Server) know how to handle this syntax. If your API doesn't understand these 'virtual fields', you will have to transform them into the expected syntax in the Data Provider.

```jsx
// in dataProvider.js
export default {
    getList: (resource, params) => {
        // transform a filter object to a filters array with operators
        // filter is like { commentable: true, released_gte: '2018-01-01' }
        const filter = params.filter;
        const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' };
        // filters is like [
        //    { field: "commentable", operator: "=", value: true},
        //    { field: "released", operator: ">=", value: '2018-01-01'}
        // ]
        const filters = Object.keys(filter).map(key => {
            const operator = operators[key.slice(-4)];
            return operator
                ? { field: key.slice(0, -4), operator, value: filter[key] }
                : { field: key, operator: '=', value: filter[key] };
        });
        const query = {
            pagination: params.pagination,
            sort: params.sort,
            filter: filters,
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(),10),
        }));
    },
    // ...
}
```

## Saved Queries: Let Users Save Filter And Sort

<video controls autoplay playsinline muted loop>
  <source src="./img/SavedQueriesList.webm" type="video/webm"/>
  <source src="./img/SavedQueriesList.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Saved Queries let users save a combination of filters and sort parameters into a new, personal filter. Saved queries persist between sessions, so users can find their custom queries even after closing and reopening the admin. Saved queries are available both for the Filter Button/Form combo and for the `<FilterList>` Sidebar. It's enabled by default for the Filter Button/Form combo but you have to add it yourself in the `<FilterList>` Sidebar. 

`<SavedQueriesList>` is a complement to `<FilterList>` sections for the filter sidebar

```diff
import { FilterList, FilterListItem, List, Datagrid } from 'react-admin';
import { Card, CardContent } from '@mui/material';

+import { SavedQueriesList } from 'react-admin';

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

## Building a Custom Filter

<video controls autoplay playsinline muted loop>
  <source src="./img/filter_with_submit.webm" type="video/webm"/>
  <source src="./img/filter_with_submit.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


If neither the Filter button/form combo nor the `<FilterList>` sidebar match your need, you can always build your own. React-admin provides shortcuts to facilitate the development of custom filters.

For instance, by default, the filter button/form combo doesn't provide a submit button, and submits automatically after the user has finished interacting with the form. This provides a smooth user experience, but for some APIs, it can cause too many calls. 

In that case, the solution is to process the filter when users click on a submit button, rather than when they type values in form inputs. React-admin doesn't provide any component for that, but it's a good opportunity to illustrate the internals of the filter functionality. We'll actually provide an alternative implementation to the Filter button/form combo.

To create a custom filter UI, we'll have to override the default List Toolbar component, which will contain both a Filter Button and a [`Filter Form`](./FilterForm.md), interacting with the List filters via the ListContext.

### Filter Callbacks

The new element can use [the `useListContext` hook](./useListContext.md) to interact with the list filter more easily. The hook returns the following constants:

- `filterValues`: Value of the filters based on the URI, e.g. `{ "commentable": true, "q": "lorem" }`
- `setFilters()`: Callback to set the filter values, e.g. `setFilters({ "commentable":true })`
- `displayedFilters`: Names of the filters displayed in the form, e.g. `['commentable', 'title']`
- `showFilter()`: Callback to display an additional filter in the form, e.g. `showFilter('views')`
- `hideFilter()`: Callback to hide a filter in the form, e.g. `hideFilter('title')`

Let's use this knowledge to write a custom `<List>` component that filters on submit.

### Custom Filter Button

The following component shows the filter form on click. We'll take advantage of the `showFilter` function:

```jsx
import { useListContext } from 'react-admin';
import { Button } from '@mui/material';
import ContentFilter from '@mui/icons-material/FilterList';

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

Next is the filter form component, displayed only when the "main" filter is displayed (i.e. when a user has clicked the filter button). The form inputs appear directly in the form, and the form submission triggers the `setFilters()` callback passed as parameter. We'll use `react-hook-form` to handle the form state:

{% raw %}
```jsx
import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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

    const form = useForm({
        defaultValues: filterValues,
    });

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
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <NullableBooleanInput
                            helperText={false}
                            source="commentable"
                        />
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
        </FormProvider>
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

export const PostList = () => (
    <List actions={<ListActions />}>
        ...
    </List>
);
```

**Tip**: No need to pass any `filters` to the list anymore, as the `<PostFilterForm>` component will display them.

You can use a similar approach to offer alternative User Experiences for data filtering, e.g. to display the filters as a line in the datagrid headers.
