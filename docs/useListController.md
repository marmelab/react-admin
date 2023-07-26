---
layout: default
title: "useListController"
---

# `useListController`

The `useListController` hook fetches the data, prepares callbacks for modifying the pagination, filters, sort and selection, and returns them. Its return value match the `ListContext` shape. `useListController` is used internally by the `<List>` and `<ListBase>` components.

You can use it to create a custom List view, although its component counterpart, [`<ListBase>`](./ListBase.md), is probably better in most cases.

## Usage

It's common to call `useListController()` without parameters, and to put the result in a `ListContext` to make it available to the rest of the component tree.

```jsx
import { 
    useListController,
    ListContextProvider
} from 'react-admin';

const MyList = () => {
    const listContext = useListController();
    return (
        <ListContextProvider value={listContext}>
            {children}
        </ListContextProvider>
    );
};
```

## Input Format

`useListController` expects one object as parameter. All keys are optional.

* [`debounce`](./List.md#debounce): debounce time in ms for the setFilters callbacks
* [`disableAuthentication`](./List.md#disableauthentication): set to true to allow anonymous access to the list
* [`disableSyncWithLocation`](./List.md#disablesyncwithlocation): set to true to have more than one list per page
* [`exporter`](./List.md#exporter): exporter function
* [`filter`](./List.md#filter-permanent-filter): permanent filter, forced over the user filter
* [`filterDefaultValues`](./List.md#filterdefaultvalues): default values for the filter form
* [`perPage`](./List.md#perpage): number of results per page
* [`queryOptions`](./List.md#queryoptions): react-query options for the useQuery call
* [`resource`](./List.md#resource): resource name, e.g. 'posts' ; defaults to the current resource context
* [`sort`](./List.md#sort), current sort value, e.g. `{ field: 'published_at', order: 'DESC' }`
* [`storeKey`](#storekey): key used to differentiate the list from another sharing the same resource, in store managed states

Here are their default values:

```jsx
import {  
    useListController,
    defaultExporter,
    ListContextProvider
} from 'react-admin';

const MyList = ({
    debounce = 500,
    disableAuthentication = false,
    disableSyncWithLocation = false,
    exporter = defaultExporter,
    filter = undefined,
    filterDefaultValues = undefined,
    perPage = 10,
    queryOptions = undefined,
    resource = '',
    sort = { field: 'id', order: 'DESC' },
    storeKey = undefined,
}) => {
    const listContext = useListController({
        debounce,
        disableAuthentication,
        disableSyncWithLocation,
        exporter,
        filter,
        filterDefaultValues,
        perPage,
        queryOptions,
        resource,
        sort,
        storeKey,
    });
    return (
        <ListContextProvider value={listContext}>
            {children}
        </ListContextProvider>
    );
};
```

## `storeKey`

To display multiple lists of the same resource and keep distinct store states for each of them (filters, sorting and pagination), specify unique keys with the `storeKey` property.

In case no `storeKey` is provided, the states will be stored with the following key: `${resource}.listParams`.

**Note:** Please note that selection state will remain linked to a resource-based key as described [here](./List.md#disablesyncwithlocation).

If you want to disable the storage of list parameters altogether for a given list, you can use [the `disableSyncWithLocation` prop](./List.md#disablesyncwithlocation).

In the example below, both lists `TopPosts` and `FlopPosts` use the same resource ('posts'), but their controller states are stored separately (under the store keys `'top'` and `'flop'` respectively).

{% raw %}
```jsx
import { useListController } from 'react-admin';

const OrderedPostList = ({
    storeKey,
    sort,
}) => {
    const params = useListController({
        resource: 'posts',
        sort,
        storeKey,
    });
    return (
        <div>
            <ul style={styles.ul}>
                {!params.isLoading &&
                    params.data.map(post => (
                        <li key={`post_${post.id}`}>
                            {post.title} - {post.votes} votes
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const TopPosts = (
    <OrderedPostList storeKey="top" sort={{ field: 'votes', order: 'DESC' }} />
);
const FlopPosts = (
    <OrderedPostList storeKey="flop" sort={{ field: 'votes', order: 'ASC' }} />
);
```
{% endraw %}

You can disable this feature by setting the `storeKey` prop to `false`. When disabled, parameters will not be persisted in the store.


## Return Value

The return value of `useListController` has the following shape:

```js
const {
    // fetched data
    data, // an array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
    total, // the total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isFetching, // boolean that is true while the data is being fetched, and false once the data is fetched
    isLoading, // boolean that is true until the data is available for the first time
    // pagination
    page, // the current page. Starts at 1
    perPage, // the number of results per page. Defaults to 25
    setPage, // a callback to change the page, e.g. setPage(3)
    setPerPage, // a callback to change the number of results per page, e.g. setPerPage(25)
    hasPreviousPage, // boolean, true if the current page is not the first one
    hasNextPage, // boolean, true if the current page is not the last one
    // sorting
    sort, // a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
    setSort, // a callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
    // filtering
    filterValues, // a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
    displayedFilters, // a dictionary of the displayed filters, e.g. { title: true, nationality: true }
    setFilters, // a callback to update the filters, e.g. setFilters(filters, displayedFilters)
    showFilter, // a callback to show one of the filters, e.g. showFilter('title', defaultValue)
    hideFilter, // a callback to hide one of the filters, e.g. hideFilter('title')
    // record selection
    selectedIds, // an array listing the ids of the selected rows, e.g. [123, 456]
    onSelect, // callback to change the list of selected rows, e.g. onSelect([456, 789])
    onToggleItem, // callback to toggle the selection of a given record based on its id, e.g. onToggleItem(456)
    onUnselectItems, // callback to clear the selection, e.g. onUnselectItems();
    // misc
    defaultTitle, // the translated title based on the resource, e.g. 'Posts'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    refetch, // callback for fetching the list data again
} = listContext;
```
