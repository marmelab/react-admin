---
title: "useDeletedRecordsListController"
---

`useDeletedRecordsListController` contains the headless logic to create a list of deleted records.

`useDeletedRecordsListController` reads the deleted records list parameters from the URL, calls `dataProvider.getListDeleted()`, prepares callbacks for modifying the pagination, filters, sort and selection, and returns them together with the data. Its return value matches the [`ListContext`](./useListContext.md) shape.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

`useDeletedRecordsListController` expects a parameters object defining the deleted records list sorting, pagination, and filters. It returns an object with the fetched data, and callbacks to modify the deleted records list parameters.

You can call `useDeletedRecordsListController()` without parameters, and then put the result in a `ListContext` to make it available to the rest of the component tree.

```tsx
import { ListContextProvider } from 'ra-core';
import { useDeletedRecordsListController } from '@react-admin/ra-core-ee';

const MyDeletedRecords = ({children}: { children: React.ReactNode }) => {
    const deletedRecordsListController = useDeletedRecordsListController();
    return (
        <ListContextProvider value={deletedRecordsListController}>
            {children}
        </ListContextProvider>
    );
};
```

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

```tsx
import { ListContextProvider } from 'ra-core';
import { useDeletedRecordsListController } from '@react-admin/ra-core-ee';

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

## `debounce`

By default, `useDeletedRecordsListController` does not refresh the data as soon as the user enters data in the filter form. Instead, it waits for half a second of user inactivity (via `lodash.debounce`) before calling the dataProvider on filter change. This is to prevent repeated (and useless) calls to the API.

You can customize the debounce duration in milliseconds - or disable it completely - by passing a `debounce` parameter:

```tsx
// wait 1 seconds instead of 500 milliseconds befoce calling the dataProvider
const deletedRecordsListController = useDeletedRecordsListController({ debounce: 1000 });
```

## `disableAuthentication`

By default, `useDeletedRecordsListController` requires the user to be authenticated - any anonymous access redirects the user to the login page.

If you want to allow anonymous access to the deleted records list page, set the `disableAuthentication` parameter to `true`.

```tsx
const anonymousDeletedRecordsListController = useDeletedRecordsListController({ disableAuthentication: true });
```

## `disableSyncWithLocation`

By default, ra-core-ee synchronizes the `useDeletedRecordsListController` parameters (sort, pagination, filters) with the query string in the URL (using `react-router` location) and the [Store](./Store.md).

You may want to disable this synchronization to keep the parameters in a local state, independent for each `useDeletedRecordsListController` call. To do so, pass the `disableSyncWithLocation` parameter. The drawback is that a hit on the "back" button doesn't restore the previous parameters.

```tsx
const deletedRecordsListController = useDeletedRecordsListController({ disableSyncWithLocation: true });
```

**Tip**: `disableSyncWithLocation` also disables the persistence of the deleted records list parameters in the Store by default. To enable the persistence of the deleted records list parameters in the Store, you can pass a custom `storeKey` parameter.

```tsx
const deletedRecordsListController = useDeletedRecordsListController({
    disableSyncWithLocation: true,
    storeKey: 'deletedRecordsListParams',
});
```

## `filter`: Permanent Filter

You can choose to always filter the list, without letting the user disable this filter - for instance to display only published posts. Write the filter to be passed to the data provider in the `filter` parameter:

```tsx
const deletedRecordsListController = useDeletedRecordsListController({
    filter: { deleted_by: 'test' },
});
```

The actual filter parameter sent to the data provider is the result of the combination of the *user* filters (the ones set through the `filters` component form), and the *permanent* filter. The user cannot override the permanent filters set by way of `filter`.

## `filterDefaultValues`

To set default values to filters, you can pass an object literal as the `filterDefaultValues` parameter of `useDeletedRecordsListController`.

```tsx
const deletedRecordsListController = useDeletedRecordsListController({
    filterDefaultValues: { deleted_by: 'test' },
});
```

**Tip**: The `filter` and `filterDefaultValues` props have one key difference: the `filterDefaultValues` can be overridden by the user, while the `filter` values are always sent to the data provider. Or, to put it otherwise:

```js
const filterSentToDataProvider = { ...filterDefaultValues, ...filterChosenByUser, ...filter };
```

## `perPage`

By default, the deleted records list paginates results by groups of 10. You can override this setting by specifying the `perPage` parameter:

```tsx
const deletedRecordsListController = useDeletedRecordsListController({ perPage: 25 });
```

## `queryOptions`

`useDeletedRecordsListController` accepts a `queryOptions` parameter to pass query options to the react-query client. Check [react-query's useQuery documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) for the list of available options.

This can be useful e.g. to pass a custom `meta` to the `dataProvider.getListDeleted()` call.

```tsx
const deletedRecordsListController = useDeletedRecordsListController({
    queryOptions: { meta: { foo: 'bar' } },
});
```

With this option, ra-core-ee will call `dataProvider.getListDeleted()` on mount with the `meta: { foo: 'bar' }` option.

You can also use the `queryOptions` parameter to override the default error side effect. By default, when the `dataProvider.getListDeleted()` call fails, ra-core-ee shows an error notification. Here is how to show a custom notification instead:

```tsx
import { useNotify, useRedirect } from 'ra-core';
import { useDeletedRecordsListController } from '@react-admin/ra-core-ee';

const CustomDeletedRecords = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load list: ${error.message}`, { type: 'error' });
        redirect('/dashboard');
    };

    const deletedRecordsListController = useDeletedRecordsListController({
        queryOptions: { onError },
    });

    return (
        <>{/* ... */}</>
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getListDeleted()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md/#error-format)).

## `resource`

`useDeletedRecordsListController` fetches the deleted records from the data provider using the `dataProvider.getListDeleted()` method. When no resource is specified, it will fetch all deleted records from all resources and display a filter.

If you want to display only the deleted records of a specific resource, you can pass the `resource` parameter:

```tsx
const deletedRecordsListController = useDeletedRecordsListController({ resource: 'posts' });
```

The title is also updated accordingly. Its translation key is `ra-soft-delete.deleted_records_list.resource_title`.

## `sort`

Pass an object literal as the `sort` parameter to determine the default `field` and `order` used for sorting:

```tsx
const PessimisticDeletedRecords = () => (
    <DeletedRecordsList sort={{ field: 'id', order: 'ASC' }} />
);
```

`sort` defines the *default* sort order ; it can still be changed by using the `setSort` function returned by the controller.

For more details on list sort, see the [Sorting The List](./ListTutorial.md/#sorting-the-list) section.

## `storeKey`

To display multiple deleted records lists and keep distinct store states for each of them (filters, sorting and pagination), specify unique keys with the `storeKey` property.

In case no `storeKey` is provided, the states will be stored with the following key: `ra-soft-delete.listParams`.

**Note**: Please note that selection state will remain linked to a constant key (`ra-soft-delete.selectedIds`) as described [here](#storekey).

If you want to disable the storage of list parameters altogether for a given list, you can use [the `disableSyncWithLocation` prop](#disablesyncwithlocation).

In the example below, the controller states of `NewestDeletedRecords` and `OldestDeletedRecords` are stored separately (under the store keys 'newest' and 'oldest' respectively).

```tsx
import { useDeletedRecordsListController } from '@react-admin/ra-core-ee';

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

You can disable this feature by setting the `storeKey` prop to `false`. When disabled, parameters will not be persisted in the store.

## Return value

`useDeletedRecordsListController` returns an object with the following keys:

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

## Security

`useDeletedRecordsListController` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](#disableauthentication) property.

If your `authProvider` implements [Access Control](./Permissions.md/#access-control), `useDeletedRecordsListController` will only render if the user has the `deleted_records` access on a virtual `ra-soft-delete` resource.

For instance, for the `<CustomDeletedRecords>` page below:

```tsx
import { useDeletedRecordsListController } from '@react-admin/ra-core-ee';

const CustomDeletedRecords = () => {
    const { isPending, error, data, total } = useDeletedRecordsListController({ filter: { resource: 'posts' } })
    if (error) return <div>Error!</div>;
    if (isPending) return <div>Loading...</div>;
    return (
        <ul>
            {data.map(deletedRecord => (
                <li key={deletedRecord.id}>
                    {deletedRecord.data.title} deleted by {deletedRecord.deleted_by}
                </li>
            ))}
        </ul>
    );
}
```

`useDeletedRecordsListController` will call `authProvider.canAccess()` using the following parameters:

```tsx
{ resource: 'ra-soft-delete', action: 'list_deleted_records' }
```

Users without access will be redirected to the [Access Denied page](./CoreAdmin.md/#accessdenied).

Note: Access control is disabled when you use [the disableAuthentication property](#disableauthentication).
