---
layout: default
title: "The useDeletedRecordsListController Hook"
---

# `useDeletedRecordsListController`

`useDeletedRecordsListController` contains the headless logic of the `<DeletedRecordsList>` component. It's useful to create a custom deleted records list. It's also the base hook when building a custom view with another UI kit than Material UI.

`useDeletedRecordsListController` reads the deleted records list parameters from the URL, calls `dataProvider.getListDeleted()`, prepares callbacks for modifying the pagination, filters, sort and selection, and returns them together with the data. Its return value matches the [`ListContext`](https://marmelab.com/react-admin/useListContext.html) shape.

## Usage

`useDeletedRecordsListController` expects a parameters object defining the deleted records list sorting, pagination, and filters. It returns an object with the fetched data, and callbacks to modify the deleted records list parameters.

When using react-admin components, you can call `useDeletedRecordsListController()` without parameters, and to put the result in a `ListContext` to make it available to the rest of the component tree.

{% raw %}
```tsx
import { ListContextProvider } from 'react-admin';
import { useDeletedRecordsListController } from '@react-admin/ra-soft-delete';

const MyDeletedRecords = ({children}: { children: React.ReactNode }) => {
    const deletedRecordsListController = useDeletedRecordsListController();
    return (
        <ListContextProvider value={deletedRecordsListController}>
            {children}
        </ListContextProvider>
    );
};
```
{% endraw %}

## Parameters

`useDeletedRecordsListController` expects an object as parameter. All keys are optional.

- [`debounce`](#debounce): Debounce time in ms for the `setFilters` callbacks.
- [`disableAuthentication`](#disableauthentication): Set to true to allow anonymous access to the list
- [`disableSyncWithLocation`](#disablesyncwithlocation): Set to true to have more than one list per page
- [`filter`](#filter-permanent-filter): Permanent filter, forced over the user filter
- [`filterDefaultValues`](#filterdefaultvalues): Default values for the filter form
- [`perPage`](#perpage): Number of results per page
- [`queryOptions`](#queryoptions): React-query options for the [`useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) call.
- [`resource`](#resource): The resource of deleted records to fetch and display (used as filter when calling `getListDeleted`)
- [`sort`](#sort): Current sort value, e.g. `{ field: 'deleted_at', order: 'ASC' }`
- [`storeKey`](#storekey): Key used to differentiate the list from another, in store managed states

Here are their default values:

{% raw %}
```tsx
import { ListContextProvider } from 'react-admin';
import { useDeletedRecordsListController } from '@react-admin/ra-soft-delete';

const CustomDeletedRecords = ({
    debounce = 500,
    disableAuthentication = false,
    disableSyncWithLocation = false,
    filter = undefined,
    filterDefaultValues = undefined,
    perPage = 10,
    queryOptions = undefined,
    sort = { field: 'deleted_at', order: 'DESC' },
    storeKey = undefined,
}) => {
    const deletedRecordsListController = useDeletedRecordsListController({
        debounce,
        disableAuthentication,
        disableSyncWithLocation,
        filter,
        filterDefaultValues,
        perPage,
        queryOptions,
        sort,
        storeKey,
    });
    return (
        <ListContextProvider value={deletedRecordsListController}>
            {children}
        </ListContextProvider>
    );
};
```
{% endraw %}

## `storeKey`

To display multiple deleted records lists and keep distinct store states for each of them (filters, sorting and pagination), specify unique keys with the `storeKey` property.

In case no `storeKey` is provided, the states will be stored with the following key: `ra-soft-delete.listParams`.

**Note**: Please note that selection state will remain linked to a constant key (`ra-soft-delete.selectedIds`) as described [here](#storekey).

If you want to disable the storage of list parameters altogether for a given list, you can use [the `disableSyncWithLocation` prop](#disablesyncwithlocation).

In the example below, the controller states of `NewestDeletedRecords` and `OldestDeletedRecords` are stored separately (under the store keys 'newest' and 'oldest' respectively).

{% raw %}
```tsx
import { useDeletedRecordsListController } from '@react-admin/ra-soft-delete';

const OrderedDeletedRecords = ({
    storeKey,
    sort,
}) => {
    const params = useDeletedRecordsListController({
        sort,
        storeKey,
    });
    return (
        <ul>
            {!params.isPending &&
                params.data.map(deletedRecord => (
                    <li key={`deleted_record_${deletedRecord.id}`}>
                        [{deletedRecord.deleted_at}] Deleted by {deletedRecord.deleted_by}: <code>{JSON.stringify(deletedRecord.data)}</code>
                    </li>
                ))}
        </ul>
    );
};

const NewestDeletedRecords = (
    <OrderedDeletedRecords storeKey="newest" sort={{ field: 'deleted_at', order: 'DESC' }} />
);
const OldestDeletedRecords = (
    <OrderedDeletedRecords storeKey="oldest" sort={{ field: 'deleted_at', order: 'ASC' }} />
);
```
{% endraw %}

You can disable this feature by setting the `storeKey` prop to `false`. When disabled, parameters will not be persisted in the store.

## Return value

`useDeletedRecordsListController` returns an object with the following keys:

{% raw %}
```tsx
const {
    // Data
    data, // Array of the deleted records, e.g. [{ id: 123, resource: 'posts', deleted_at: '2025-03-25T12:32:22Z', deleted_by: 'test', data: { ... } }, { ... }, ...]
    total, // Total number of deleted records for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isPending, // Boolean, true until the data is available
    isFetching, // Boolean, true while the data is being fetched, false once the data is fetched
    isLoading, // Boolean, true until the data is fetched for the first time
    // Pagination
    page, // Current page. Starts at 1
    perPage, // Number of results per page. Defaults to 25
    setPage, // Callback to change the page, e.g. setPage(3)
    setPerPage, // Callback to change the number of results per page, e.g. setPerPage(25)
    hasPreviousPage, // Boolean, true if the current page is not the first one
    hasNextPage, // Boolean, true if the current page is not the last one
    // Sorting
    sort, // Sort object { field, order }, e.g. { field: 'deleted_at', order: 'DESC' }
    setSort, // Callback to change the sort, e.g. setSort({ field: 'id', order: 'ASC' })
    // Filtering
    filterValues, // Dictionary of filter values, e.g. { resource: 'posts', deleted_by: 'test' }
    setFilters, // Callback to update the filters, e.g. setFilters(filters)
    // Record selection
    selectedIds, // Array listing the ids of the selected deleted records, e.g. [123, 456]
    onSelect, // Callback to change the list of selected deleted records, e.g. onSelect([456, 789])
    onToggleItem, // Callback to toggle the deleted record selection for a given id, e.g. onToggleItem(456)
    onUnselectItems, // Callback to clear the deleted records selection, e.g. onUnselectItems();
    // Misc
    defaultTitle, // Translated title, e.g. 'Archives'
    refetch, // Callback for fetching the deleted records again
} = useDeletedRecordsListController();
```
{% endraw %}

## Security

`useDeletedRecordsListController` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](#disableauthentication) property.

If your `authProvider` implements [Access Control](https://marmelab.com/react-admin/Permissions.html#access-control), `useDeletedRecordsListController` will only render if the user has the `deleted_records` access on a virtual `ra-soft-delete` resource.

For instance, for the `<CustomDeletedRecords>` page below:

{% raw %}
```tsx
import { SimpleList } from 'react-admin';
import { useDeletedRecordsListController } from '@react-admin/ra-soft-delete';

const CustomDeletedRecords = () => {
    const { isPending, error, data, total } = useDeletedRecordsListController({ filter: { resource: 'posts' } })
    if (error) return <div>Error!</div>;
    return (
        <SimpleList
            data={data}
            total={total}
            isPending={isPending}
            primaryText="%{data.title}"
        />
    );
}
```
{% endraw %}

`useDeletedRecordsListController` will call `authProvider.canAccess()` using the following parameters:

```tsx
{ resource: 'ra-soft-delete', action: 'list_deleted_records' }
```

Users without access will be redirected to the [Access Denied page](https://marmelab.com/react-admin/Admin.html#accessdenied).

Note: Access control is disabled when you use [the disableAuthentication property](#disableauthentication).