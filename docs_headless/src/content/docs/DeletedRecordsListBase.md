---
title: "<DeletedRecordsListBase>"
---

The `<DeletedRecordsListBase>` component fetches a list of deleted records from the data provider.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

`<DeletedRecordsListBase>` uses `dataProvider.getListDeleted()` to get the deleted records to display, so in general it doesn't need any property.
However, you need to define the route to reach this component manually using [`<CustomRoutes>`](./CustomRoutes.md).

```tsx
// in src/App.js
import { CoreAdmin, CustomRoutes } from 'ra-core';
import { Route } from 'react-router-dom';
import { DeletedRecordsListBase, DeletedRecordRepresentation } from '@react-admin/ra-core-ee';

export const App = () => (
    <CoreAdmin>
        ...
        <CustomRoutes>
            <Route
                path="/deleted"
                element={
                    <DeletedRecordsListBase>
                        <WithListContext
                            render={({ isPending, data }) => isPending ? null : (
                                <ul>
                                    {data.map(record => (
                                        <li key={record.id}>
                                            <div><strong>{record.resource}</strong></div>
                                            <DeletedRecordRepresentation record={record} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                    </DeletedRecordsListBase>
                }
            />
        </CustomRoutes>
    </CoreAdmin>
);
```

That's enough to display the deleted records list, with functional simple filters, sort and pagination.

## Props

| Prop                       | Required       | Type                            | Default                                  | Description                                                                                      |
|----------------------------|----------------|---------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------|
| `children`                 | Required       | `Element`                       |                   | The component used to render the list of deleted records.                                        |
| `authLoading`              | Optional       | `ReactNode`                     | -                                        | The component to render while checking for authentication and permissions.                       |
| `debounce`                 | Optional       | `number`                        | `500`                                    | The debounce delay in milliseconds to apply when users change the sort or filter parameters.     |
| `disable Authentication`   | Optional       | `boolean`                       | `false`                                  | Set to `true` to disable the authentication check.                                               |
| `disable SyncWithLocation` | Optional       | `boolean`                       | `false`                                  | Set to `true` to disable the synchronization of the list parameters with the URL.                |
| `empty`                    | Optional       | `ReactNode`                     | -                                        | The component to display when the list is empty.                                                 |
| `error`                    | Optional       | `ReactNode`                     | -                                        | The component to render when failing to load the list of records.                                |
| `filter`                   | Optional       | `object`                        | -                                        | The permanent filter values.                                                                     |
| `filter DefaultValues`     | Optional       | `object`                        | -                                        | The default filter values.                                                                       |
| `loading`                  | Optional       | `ReactNode`                     | -                                        | The component to render while loading the list of records.                                       |
| `offline`                  | Optional       | `ReactNode`                     |                              | The component to render when there is no connectivity and there is no data in the cache          |
| `perPage`                  | Optional       | `number`                        | `10`                                     | The number of records to fetch per page.                                                         |
| `queryOptions`             | Optional       | `object`                        | -                                        | The options to pass to the `useQuery` hook.                                                      |
| `resource`                 | Optional       | `string`                        | -                                        | The resource of deleted records to fetch and display                                             |
| `sort`                     | Optional       | `object`                        | `{ field: 'deleted_at', order: 'DESC' }` | The initial sort parameters.                                                                     |
| `storeKey`                 | Optional       | `string` or `false`             | -                                        | The key to use to store the current filter & sort. Pass `false` to disable store synchronization |

## `authLoading`

By default, `<DeletedRecordsListBase>` renders its children while checking for authentication and permissions. You can display a custom component via the `authLoading` prop:

```jsx
export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase authLoading={<p>Checking for permissions...</p>} />
);
```

## `children`

A component that uses `ListContext` to render the deleted records:

```tsx
import { DeletedRecordsListBase, DeletedRecordRepresentation } from '@react-admin/ra-core-ee';

export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase>
        <WithListContext
            render={({ isPending, data }) => isPending ? null : (
                <ul>
                    {data.map(record => (
                        <li key={record.id}>
                            <div><strong>{record.resource}</strong></div>
                            <DeletedRecordRepresentation record={record} /> 
                        </li>
                    ))}
                </ul>
            )}
        />
    </DeletedRecordsListBase>
);
```

## `debounce`

By default, `<DeletedRecordsListBase>` does not refresh the data as soon as the user enters data in the filter form. Instead, it waits for half a second of user inactivity (via `lodash.debounce`) before calling the dataProvider on filter change. This is to prevent repeated (and useless) calls to the API.

You can customize the debounce duration in milliseconds - or disable it completely - by passing a `debounce` prop to the `<DeletedRecordsListBase>` component:

```tsx
// wait 1 seconds instead of 500 milliseconds befoce calling the dataProvider
const DeletedRecordsWithDebounce = () => <DeletedRecordsListBase debounce={1000} />;
```

## `disableAuthentication`

By default, `<DeletedRecordsListBase>` requires the user to be authenticated - any anonymous access redirects the user to the login page.

If you want to allow anonymous access to the deleted records list page, set the `disableAuthentication` prop to `true`.

```tsx
const AnonymousDeletedRecords = () => <DeletedRecordsListBase disableAuthentication />;
```

## `disableSyncWithLocation`

By default, react-admin synchronizes the `<DeletedRecordsListBase>` parameters (sort, pagination, filters) with the query string in the URL (using `react-router` location) and the [Store](./Store.md).

You may want to disable this synchronization to keep the parameters in a local state, independent for each `<DeletedRecordsListBase>` instance. To do so, pass the `disableSyncWithLocation` prop. The drawback is that a hit on the "back" button doesn't restore the previous parameters.

```tsx
const DeletedRecordsWithoutSyncWithLocation = () => <DeletedRecordsListBase disableSyncWithLocation />;
```

**Tip**: `disableSyncWithLocation` also disables the persistence of the deleted records list parameters in the Store by default. To enable the persistence of the deleted records list parameters in the Store, you can pass a custom `storeKey` prop.

```tsx
const DeletedRecordsSyncWithStore = () => <DeletedRecordsListBase disableSyncWithLocation storeKey="deletedRecordsListParams" />;
```

## `empty`

By default, `<DeletedRecordsListBase>` renders the children when there are no deleted records to show. You can render a custom component via the `empty` prop:

```jsx
export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase empty={<p>The trash is empty!</p>} />
);
```

## `error`

By default, `<DeletedRecordsListBase>` renders the children when an error happens while loading the list of deleted records. You can render an error component via the `error` prop:

```jsx
export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase error={<p>Something went wrong while loading your posts!</p>} />
);
```

## `filter`: Permanent Filter

You can choose to always filter the list, without letting the user disable this filter - for instance to display only published posts. Write the filter to be passed to the data provider in the `filter` prop:

```tsx
const DeletedPostsList = () => (
    <DeletedRecordsListBase filter={{ resource: 'posts' }} />
);
```

The actual filter parameter sent to the data provider is the result of the combination of the *user* filters (the ones set through the `filters` component form), and the *permanent* filter. The user cannot override the permanent filters set by way of `filter`.

## `filterDefaultValues`

To set default values to filters, you can pass an object literal as the `filterDefaultValues` prop of the `<DeletedRecordsListBase>` element.

```tsx
const CustomDeletedRecords = () => (
    <DeletedRecordsListBase filterDefaultValues={{ resource: 'posts' }} />
);
```

**Tip**: The `filter` and `filterDefaultValues` props have one key difference: the `filterDefaultValues` can be overridden by the user, while the `filter` values are always sent to the data provider. Or, to put it otherwise:

```js
const filterSentToDataProvider = { ...filterDefaultValues, ...filterChosenByUser, ...filter };
```

## `loading`

By default, `<DeletedRecordsList>` renders the children while loading the list of deleted records. You can display a component during this time via the `loading` prop:

```jsx
export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase loading={<p>Loading...</p>} />
);
```

## `offline`

By default, `<DeletedRecordsListBase>` renders the children when there is no connectivity and there are no records in the cache yet for the current parameters (page, sort, etc.). You can provide your own component via the `offline` prop:

```jsx
export const CustomDeletedRecords = () => (
    <DeletedRecordsListBase offline={<p>No network. Could not load the posts.</p>} />
);
```

## `perPage`

By default, the deleted records list paginates results by groups of 10. You can override this setting by specifying the `perPage` prop:

```tsx
const DeletedRecordsWithCustomPagination = () => <DeletedRecordsListBase perPage={25} />;
```

## `queryOptions`

`<DeletedRecordsListBase>` accepts a `queryOptions` prop to pass query options to the react-query client. Check [react-query's useQuery documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) for the list of available options.

This can be useful e.g. to pass a custom `meta` to the `dataProvider.getListDeleted()` call.

```tsx
const CustomDeletedRecords = () => (
    <DeletedRecordsListBase queryOptions={{ meta: { foo: 'bar' } }} />
);
```

With this option, react-admin will call `dataProvider.getListDeleted()` on mount with the `meta: { foo: 'bar' }` option.

You can also use the `queryOptions` prop to override the default error side effect. By default, when the `dataProvider.getListDeleted()` call fails, react-admin shows an error notification. Here is how to show a custom notification instead:

```tsx
import { useNotify, useRedirect } from 'ra-core';
import { DeletedRecordsListBase } from '@react-admin/ra-core-ee';

const CustomDeletedRecords = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load list: ${error.message}`, { type: 'error' });
        redirect('/dashboard');
    };

    return (
        <DeletedRecordsListBase queryOptions={{ onError }} />
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getListDeleted()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

## `resource`

`<DeletedRecordsListBase>` fetches the deleted records from the data provider using the `dataProvider.getListDeleted()` method. When no resource is specified, it will fetch all deleted records from all resources and display a filter.

If you want to display only the deleted records of a specific resource, you can pass the `resource` prop:

```tsx
const DeletedPosts = () => (
    <DeletedRecordsListBase resource="posts" />
);
```

When a resource is specified, the filter will not be displayed, and the list will only show deleted records of that resource.

The title is also updated accordingly. Its translation key is `ra-soft-delete.deleted_records_list.resource_title`.

## `sort`

Pass an object literal as the `sort` prop to determine the default `field` and `order` used for sorting:

```tsx
const PessimisticDeletedRecords = () => (
    <DeletedRecordsListBase sort={{ field: 'id', order: 'ASC' }} />
);
```

`sort` defines the *default* sort order ; the list remains sortable by clicking on column headers.

For more details on list sort, see the [Sorting The List](./ListTutorial.md#sorting-the-list) section.

## `storeKey`

By default, react-admin stores the list parameters (sort, pagination, filters) in localStorage so that users can come back to the list and find it in the same state as when they left it.
The `<DeletedRecordsListBase>` component uses a specific identifier to store the list parameters under the key `ra-soft-delete.listParams`.

If you want to use multiple `<DeletedRecordsList>` and keep distinct store states for each of them (filters, sorting and pagination), you must give each list a unique `storeKey` property. You can also disable the persistence of list parameters and selection in the store by setting the `storeKey` prop to `false`.

In the example below, the deleted records lists store their list parameters separately (under the store keys `'deletedBooks'` and `'deletedAuthors'`). This allows to use both components in the same app, each having its own state (filters, sorting and pagination).

```tsx
import { CoreAdmin, CustomRoutes } from 'ra-core';
import { Route } from 'react-router-dom';
import { DeletedRecordsListBase } from '@react-admin/ra-core-ee';

const Admin = () => {
    return (
        <CoreAdmin dataProvider={dataProvider}>
            <CustomRoutes>
                <Route path="/books/deleted" element={
                    <DeletedRecordsListBase filter={{ resource: 'books' }} storeKey="deletedBooks" />
                } />
                <Route path="/authors/deleted" element={
                    <DeletedRecordsListBase filter={{ resource: 'authors' }} storeKey="deletedAuthors" />
                } />
            </CustomRoutes>
            <Resource name="books" />
        </CoreAdmin>
    );
};
```

**Tip:** The `storeKey` is actually passed to the underlying `useDeletedRecordsListController` hook, which you can use directly for more complex scenarios. See the [`useDeletedRecordsListController` doc](./useDeletedRecordsListController.md) for more info.

**Note:** *Selection state* will remain linked to a global key regardless of the specified `storeKey` string. This is a design choice because if row selection is not stored globally, then when a user permanently deletes or restores a record it may remain selected without any ability to unselect it. If you want to allow custom `storeKey`'s for managing selection state, you will have to implement your own `useDeletedRecordsListController` hook and pass a custom key to the `useRecordSelection` hook. You will then need to implement your own delete buttons to manually unselect rows when deleting or restoring records. You can still opt out of all store interactions including selection if you set it to `false`.
