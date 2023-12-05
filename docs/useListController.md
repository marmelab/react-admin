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

## Parameters

`useListController` expects an object as parameter. All keys are optional.

* [`debounce`](./List.md#debounce): Debounce time in ms for the setFilters callbacks
* [`disableAuthentication`](./List.md#disableauthentication): Set to true to allow anonymous access to the list
* [`disableSyncWithLocation`](./List.md#disablesyncwithlocation): Set to true to have more than one list per page
* [`exporter`](./List.md#exporter): Exporter function
* [`filter`](./List.md#filter-permanent-filter): Permanent filter, forced over the user filter
* [`filterDefaultValues`](./List.md#filterdefaultvalues): Default values for the filter form
* [`perPage`](./List.md#perpage): Number of results per page
* [`queryOptions`](./List.md#queryoptions): React-query options for the useQuery call
* [`resource`](./List.md#resource): Resource name, e.g. 'posts' ; defaults to the current resource context
* [`sort`](./List.md#sort): Current sort value, e.g. `{ field: 'published_at', order: 'DESC' }`
* [`storeKey`](#storekey): Key used to differentiate the list from another sharing the same resource, in store managed states

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

`useListController` returns an object with the following keys: 

**Data**

* `data`: Array of the list records, e.g. `[{ id: 123, title: 'hello world' }, { ... }`
* `total`: Total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
* `isFetching`: Boolean, `true` while the data is being fetched, `false` once the data is fetched
* `isLoading`: Boolean, `true` until the data is available for the first time

**Pagination**

* `page`: Current page. Starts at 1
* `perPage`: Number of results per page. Defaults to 25
* `setPage`: Callback to change the page, e.g. `setPage(3)`
* `setPerPage`: Callback to change the number of results per page, e.g. `setPerPage(25)`
* `hasPreviousPage`: Boolean, `true` if the current page is not the first one
* `hasNextPage`: Boolean, `true` if the current page is not the last one

**Sorting**

* `sort`: Sort object `{ field, order }`, e.g. `{ field: 'date', order: 'DESC' }`
* `setSort`: Callback to change the sort, e.g. `setSort({ field: 'name', order: 'ASC' })`

**Filtering**

* `filterValues`: Dictionary of filter values, e.g. `{ title: 'lorem', nationality: 'fr' }`
* `displayedFilters`: Dictionary of displayed filters, e.g. `{ title: true, nationality: true }`
* `setFilters`: Callback to update the filters, e.g. `setFilters(filters, displayedFilters)`
* `showFilter`: Callback to show one of the filters, e.g. `showFilter('title', defaultValue)`
* `hideFilter`: Callback to hide one of the filters, e.g. `hideFilter('title')`

**Record selection**

* `selectedIds`: Array listing the ids of the selected records, e.g. `[123, 456]`
* `onSelect`: Callback to change the list of selected records, e.g. `onSelect([456, 789])`
* `onToggleItem`: Callback to toggle the record selection for a given id, e.g. `onToggleItem(456)`
* `onUnselectItems`: Callback to clear the record selection, e.g. `onUnselectItems();`

**Misc**

* `defaultTitle`: Translated title based on the resource, e.g. 'Posts'
* `resource`: Resource name, deduced from the location. e.g. 'posts'
* `refetch`: Callback for fetching the list data again
