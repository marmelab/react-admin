---
title: "<ListBase>"
---

`<ListBase>` is a headless List page component. It fetches a list of records from the data provider, puts it in a [`ListContext`](./useListContext.md), and renders its children. Use it to build a custom list layout.

It does not render any UI by itself - no title, no actions, no styling, and no pagination. This allows you to create fully custom list layouts.

`<ListBase>` relies on the [`useListController`](./useListController.md) hook.

## Usage

You can use `ListBase` to create your own custom List page component, like this one:

```jsx
import { ListBase } from 'ra-core';
import { 
    DataTable,
    ListToolbar,
    Pagination,
    Title,
} from './components';

const PostList = () => (
    <ListBase>
        <Title title="Post List"/>
        <ListToolbar
            filters={[
                { source: 'q', label: 'Search' },
                { source: 'published', label: 'Published', type: 'boolean' },
            ]}
        />
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
        <Pagination />
    </ListBase>
);
```

Alternatively, you can pass a `render` function prop instead of `children`. This function will receive the `ListContext` as argument.

```jsx
import { ListBase } from 'ra-core';
import { 
    DataTable,
    ListToolbar,
    Pagination,
    Title,
} from './components';

const PostList = () => (
    <ListBase render={({ data, total, isPending, error }) => (
        <Title title="Post List" />
        <ListToolbar
            filters={[
                { source: 'q', label: 'Search', alwaysOn: true },
                { source: 'published', label: 'Published', type: 'boolean' },
            ]}
        />
        <DataTable>
            {data?.map(record => (
                <DataTable.Row key={record.id}>
                    <DataTable.Col source="title" record={record} />
                    <DataTable.Col source="author" record={record} />
                    <DataTable.Col source="published_at" record={record} />
                </DataTable.Row>
            ))}
        </DataTable>
        <Pagination total={total} />
    )} />
);
```

## Props

The `<ListBase>` component accepts the following props:

| Prop                      | Required                | Type        | Default | Description                                                                                  |
| ------------------------- | ----------------------- | ----------- | ------- | -------------------------------------------------------------------------------------------- |
| `children`                | Required if no render   | `ReactNode` | -       | The component to use to render the list of records.                                          |
| `render`                  | Required if no children | `ReactNode` | -       | A function that render the list of records, receives the list context as argument.           |
| `debounce`                | Optional                | `number`    | `500`   | The debounce delay in milliseconds to apply when users change the sort or filter parameters. |
| `disableAuthentication`   | Optional                | `boolean`   | `false` | Set to `true` to disable the authentication check.                                           |
| `disableSyncWithLocation` | Optional                | `boolean`   | `false` | Set to `true` to disable the synchronization of the list parameters with the URL.            |
| `exporter`                | Optional                | `function`  | -       | The function to call to export the list.                                                     |
| `filter`                  | Optional                | `object`    | -       | The permanent filter values.                                                                 |
| `filterDefaultValues`     | Optional                | `object`    | -       | The default filter values.                                                                   |
| `perPage`                 | Optional                | `number`    | `10`    | The number of records to fetch per page.                                                     |
| `queryOptions`            | Optional                | `object`    | -       | The options to pass to the `useQuery` hook.                                                  |
| `resource`                | Optional                | `string`    | -       | The resource name, e.g. `posts`.                                                             |
| `sort`                    | Optional                | `object`    | -       | The initial sort parameters.                                                                 |

In addition, `<ListBase>` renders its children components inside a `ListContext`. The context provides access to the list data, pagination, sorting, and filtering state.

## `debounce`

By default, `<ListBase>` does not refresh the data as soon as the user enters data in the filter form. Instead, it waits for half a second of user inactivity (via `lodash.debounce`) before calling the dataProvider on filter change. This is to prevent repeated (and useless) calls to the API.

You can customize the debounce duration in milliseconds - or disable it completely - by passing a `debounce` prop to the `<ListBase>` component:

```jsx
import { ListBase } from 'ra-core';
import { DataTable, FilterForm } from './components';

// wait 1 second instead of 500 milliseconds before calling the dataProvider
const PostList = () => (
    <ListBase debounce={1000}>
        <FilterForm />
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

## `disableAuthentication`

By default, all pages using `<ListBase>` require the user to be authenticated - any anonymous access redirects the user to the login page.

If you want to allow anonymous access to a List page, set the `disableAuthentication` prop to `true`.

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

const PublicBookList = () => (
    <ListBase disableAuthentication>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </ListBase>
);
```

## `disableSyncWithLocation`

By default, ra-core synchronizes the `<ListBase>` parameters (sort, pagination, filters) with the query string in the URL (using `react-router` location) and the [Store](./Store.md).

When you use a `<ListBase>` component anywhere else than as `<Resource list>`, you may want to disable this synchronization to keep the parameters in a local state, independent for each `<ListBase>` instance. This allows to have multiple lists on a single page. To do so, pass the `disableSyncWithLocation` prop. The drawback is that a hit on the "back" button doesn't restore the previous list parameters.

```jsx
import { ListBase, ResourceContextProvider } from 'ra-core';
import { DataTable } from './components';

const Dashboard = () => (
    <div>
        <ResourceContextProvider value="posts">
            <ListBase disableSyncWithLocation>
                <DataTable>
                    <DataTable.Col source="title" />
                    <DataTable.Col source="views" />
                    <DataTable.Col source="published_at" />
                </DataTable>
            </ListBase>
        </ResourceContextProvider>
        <ResourceContextProvider value="comments">
            <ListBase disableSyncWithLocation>
                <DataTable>
                    <DataTable.Col source="title" />
                    <DataTable.Col source="author" />
                    <DataTable.Col source="created_at" />
                </DataTable>
            </ListBase>
        </ResourceContextProvider>
    </div>
);
```

**Tip**: `disableSyncWithLocation` also disables the persistence of the list parameters in the Store by default. To enable the persistence of the list parameters in the Store, you can pass a custom `storeKey` prop.

```jsx
import { ListBase, ResourceContextProvider } from 'ra-core';
import { DataTable } from './components';

const Dashboard = () => (
    <div>
        <ResourceContextProvider value="posts">
            <ListBase disableSyncWithLocation storeKey="postsListParams">
                <DataTable>
                    <DataTable.Col source="title" />
                    <DataTable.Col source="views" />
                </DataTable>
            </ListBase>
        </ResourceContextProvider>
    </div>
);
```

## `exporter`

Among the common list actions, ra-core includes export functionality. When using `<ListBase>`, you can provide a custom `exporter` function to handle data export.

By default, clicking an export button will:

1. Call the `dataProvider` with the current sort and filter (but without pagination),
2. Transform the result into a CSV string,
3. Download the CSV file.

The columns of the CSV file match all the fields of the records in the `dataProvider` response. If you want to customize the result, pass a custom `exporter` function to the `<ListBase>`. This function will receive the data from the `dataProvider` and is in charge of transforming, converting, and downloading the file.

**Tip**: For CSV conversion, you can import [jsonexport](https://github.com/kauegimenes/jsonexport#browser-import-examples), a JSON to CSV converter which is already a ra-core dependency. And for CSV download, take advantage of ra-core's `downloadCSV` function.

Here is an example for a Posts exporter, omitting, adding, and reordering fields:

```jsx
import { ListBase, downloadCSV } from 'ra-core';
import jsonExport from 'jsonexport/dist';
import { DataTable, ExportButton } from './components';

const exporter = posts => {
    const postsForExport = posts.map(post => {
        const { backlinks, author, ...postForExport } = post; // omit backlinks and author
        postForExport.author_name = post.author.name; // add a field
        return postForExport;
    });
    jsonExport(postsForExport, {
        headers: ['id', 'title', 'author_name', 'body'] // order fields in the export
    }, (err, csv) => {
        downloadCSV(csv, 'posts'); // download as 'posts.csv` file
    });
};

const PostList = () => (
    <ListBase exporter={exporter}>
        <ExportButton />
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="body" />
        </DataTable>
    </ListBase>
);
```

In many cases, you'll need more than simple object manipulation. You'll need to *augment* your objects based on relationships. For instance, the export for comments should include the title of the related post - but the export only exposes a `post_id` by default. For that purpose, the exporter receives a `fetchRelatedRecords` function as the second parameter. It fetches related records using your `dataProvider.getMany()` method and returns a promise.

Here is an example for a Comments exporter, fetching related Posts:

```jsx
import { ListBase, downloadCSV } from 'ra-core';
import jsonExport from 'jsonexport/dist';
import { DataTable, ExportButton } from './components';

const exporter = async (comments, fetchRelatedRecords) => {
    // will call dataProvider.getMany('posts', { ids: records.map(record => record.post_id) }),
    // ignoring duplicate and empty post_id
    const posts = await fetchRelatedRecords(comments, 'post_id', 'posts');
    const commentsWithPostTitle = comments.map(comment => ({
        ...comment,
        post_title: posts[comment.post_id].title,
    }));
    return jsonExport(commentsWithPostTitle, {
        headers: ['id', 'post_id', 'post_title', 'body'],
    }, (err, csv) => {
        downloadCSV(csv, 'comments');
    });
};

const CommentList = () => (
    <ListBase exporter={exporter}>
        <ExportButton />
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="post_id" />
            <DataTable.Col source="body" />
        </DataTable>
    </ListBase>
);
```

## `filter`: Permanent Filter

You can choose to always filter the list, without letting the user disable this filter - for instance to display only published posts. Write the filter to be passed to the data provider in the `filter` props:

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

// only show published posts
export const PostList = () => (
    <ListBase filter={{ is_published: true }}>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

The actual filter parameter sent to the data provider is the result of the combination of the *user* filters (the ones set through filter components), and the *permanent* filter. The user cannot override the permanent filters set by way of `filter`.

## `filterDefaultValues`

To set default values to filters, you can pass an object literal as the `filterDefaultValues` prop of the `<ListBase>` element.

```jsx
import { ListBase } from 'ra-core';
import { DataTable, FilterForm, TextInput, BooleanInput } from './components';

const PostList = () => (
    <ListBase filterDefaultValues={{ is_published: true, category: 'tech' }}>
        <FilterForm>
            <TextInput label="Search" source="q" />
            <BooleanInput source="is_published" />
            <TextInput source="title" defaultValue="Hello, World!" />
            <TextInput source="category" />
        </FilterForm>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

**Tip**: The `filter` and `filterDefaultValues` props have one key difference: the `filterDefaultValues` can be overridden by the user, while the `filter` values are always sent to the data provider. Or, to put it otherwise:

```js
const filterSentToDataProvider = { ...filterDefaultValues, ...filterChosenByUser, ...filter };
```

## `perPage`

By default, the list paginates results by groups of 10. You can override this setting by specifying the `perPage` prop:

```jsx
import { ListBase } from 'ra-core';
import { DataTable, Pagination } from './components';

export const PostList = () => (
    <ListBase perPage={25}>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
        <Pagination />
    </ListBase>
);
```

## `queryOptions`

`<ListBase>` accepts a `queryOptions` prop to pass [query options](./DataProviders.md#react-query-options) to the react-query client. Check react-query's [`useQuery` documentation](https://tanstack.com/query/v5/docs/react/reference/useQuery) for the list of available options.

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getList()` call.

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

const PostList = () => (
    <ListBase queryOptions={{ meta: { foo: 'bar' } }}>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

With this option, ra-core will call `dataProvider.getList()` on mount with the `meta: { foo: 'bar' }` option.

You can also use the `queryOptions` prop to override the default error side effect. By default, when the `dataProvider.getList()` call fails, ra-core shows an error notification. Here is how to show a custom notification instead:

```jsx
import { useNotify, useRedirect, ListBase } from 'ra-core';
import { DataTable } from './components';

const PostList = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load list: ${error.message}`, { type: 'error' });
        redirect('/dashboard');
    };

    return (
        <ListBase queryOptions={{ onError }}>
            <DataTable>
                <DataTable.Col source="title" />
                <DataTable.Col source="author" />
                <DataTable.Col source="published_at" />
            </DataTable>
        </ListBase>
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getList()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

## `resource`

By default, `<ListBase>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts` path, the `resource` prop will be `posts`. You may want to force a different resource for a list. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

export const UsersList = () => (
    <ListBase resource="users">
        <DataTable>
            <DataTable.Col source="name" />
            <DataTable.Col source="email" />
            <DataTable.Col source="role" />
        </DataTable>
    </ListBase>
);
```

## `sort`

Pass an object literal as the `sort` prop to determine the default `field` and `order` used for sorting:

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

export const PostList = () => (
    <ListBase sort={{ field: 'published_at', order: 'DESC' }}>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

`sort` defines the *default* sort order; the list remains sortable by clicking on column headers (if your DataTable component supports it).

## Security

The `<ListBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the `disableAuthentication` prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ListBase>` will only render if the user has the "list" access to the related resource.

For instance, for the `<PostList>` page below:

```tsx
import { ListBase } from 'ra-core';
import { DataTable } from './components';

// Resource name is "posts"
const PostList = () => (
    <ListBase>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

`<ListBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "list", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use the `disableAuthentication` prop.
