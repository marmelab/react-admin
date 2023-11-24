---
layout: default
title: "The DatagridAG Component"
---

# `<DatagridAG>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component is an alternative datagrid component with advanced features, based on [ag-grid](https://www.ag-grid.com/).

> **Note:** This component is still in **alpha** stage. Major changes may still be introduced in the future.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Here is a (non-exhaustive) list of [features](https://www.ag-grid.com/react-data-grid/) that `<DatagridAG>` offers:

-   In place editing of cells or rows
-   Advanced filtering
-   Columns resizing and reordering
-   Automatic page size
-   Automatic column size
-   Themes
-   Row selection and bulk actions
-   Compatibility with React Admin fields

Additionally, `<DatagridAG>` is compatible with the [Enterprise version of ag-grid](https://www.ag-grid.com/react-data-grid/licensing/), which offers even more features:

-   Row Grouping
-   Aggregation
-   Tree Data
-   Pivoting
-   More advanced filtering
-   Master Detail views
-   Range Selection
-   Excel Export
-   And more...

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-enterprise.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

First, install the `@react-admin/ra-datagrid-ag` package:

```sh
npm install --save @react-admin/ra-datagrid-ag
# or
yarn add @react-admin/ra-datagrid-ag
```

**Tip**: `ra-datagrid-ag` is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://marmelab.com/ra-enterprise/) plans to access this package.

Then, use `<DatagridAG>` as a child of a react-admin `<List>`, `<ReferenceManyField>`, or any other component that creates a `ListContext`.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} />
        </List>
    );
};
```

![DatagridAG PostList](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-PostList.png)

Here are the important things to note:

-   You need to import the ag-grid stylesheets `ag-grid.css` and `ag-theme-alpine.css`.
-   To benefit from ag-grid's filtering and sorting features (as well as some Enterprise features like grouping), you need to load the entire list of records client-side. To do so, you must set `<List perPage>` to a high number (e.g. 10,000).
-   As the pagination is handled by ag-grid, you can disable react-admin's pagination with `<List pagination={false}>`.
-   The columns are defined using the `columnDefs` prop. See [the dedicated doc section](#columndefs) for more information.

`<DatagridAG>` doesn't currently support the [server-side row model](https://www.ag-grid.com/react-data-grid/row-models/), so you have to load all data client-side. The client-side performance isn't affected by a large number of records, as ag-grid uses [DOM virtualization](https://www.ag-grid.com/react-data-grid/dom-virtualisation/). `<DatagridAG>` has been tested with 10,000 records without any performance issue.

## Props

| Prop                | Required | Type                        | Default                      | Description                                                                                  |
| ------------------- | -------- | --------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| `columnDefs`        | Required | Array                       | n/a                          | The columns definitions                                                                      |
| `bulkActionButtons` | Optional | Element                     | `<BulkDelete Button>`        | The component used to render the bulk action buttons                                         |
| `cellRenderer`      | Optional | String, Function or Element |                              | Allows to use a custom component to render the cell content                                  |
| `defaultColDef`     | Optional | Object                      |                              | The default column definition (applied to all columns)                                       |
| `mutationOptions`   | Optional | Object                      |                              | The mutation options                                                                         |
| `preferenceKey`     | Optional | String or `false`           | `${resource}.ag-grid.params` | The key used to persist columns order and sizing in the Store. `false` disables persistence. |
| `sx`                | Optional | Object                      |                              | The sx prop passed down to the wrapping `<div>` element                                      |
| `theme`             | Optional | String                      | `'ag-theme-alpine'`          | The name of the ag-grid theme                                                                |
| `pagination`        | Optional | Boolean                     | `true`                       | Enable or disable pagination                                                                 |

`<DatagridAG>` also accepts the same props as [`<AgGridReact>`](https://www.ag-grid.com/react-data-grid/grid-options/) with the exception of `rowData`, since the data is fetched from the List context.

## Defaults

Under the hood, `<DatagridAG>` is a wrapper around `<AgGridReact>`. However, it sets some important default values:

-   `pagination` is set to `true`
-   `paginationAutoPageSize` is set to `true`
-   `animateRows` is set to `true`
-   `rowSelection` is set to `'multiple'`
-   `suppressRowClickSelection` is set to `true`
-   `readOnlyEdit` is set to `true`
-   `getRowId` is set to use the record `id` field

It also includes a [`defaultColDef`](#defaultcoldef) object with the following properties:

```js
{
    resizable: true,
    filter: true,
    sortable: true,
    editable: true,
    headerCheckboxSelectionFilteredOnly: true,
    headerCheckboxSelectionCurrentPageOnly: true,
}
```

You may override any of these defaults by passing the corresponding props to `<DatagridAG>` (`defaultColDef` will be merged with the defaults).

## `columnDefs`

The `columnDefs` prop is the most important prop of `<DatagridAG>`. It defines the columns of the grid, and their properties. It is an array of objects, each object representing a column.

Here is an example with a complete column definitions object:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const truncate = (str: string, n: number) => {
    return str.length > n ? str.slice(0, n - 1) + '...' : str;
};

export const PostList = () => {
    const columnDefs = [
        {
            field: 'id',
            editable: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 48,
            maxWidth: 48,
        },
        { field: 'title' },
        {
            field: 'published_at',
            headerName: 'Publication Date',
        },
        {
            field: 'body',
            cellRenderer: ({ value }) => truncate(value, 20),
        },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} />
        </List>
    );
};
```

![DatagridAG custom columnDefs](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-select-rows.png)

Have a look at [the ag-grid documentation](https://www.ag-grid.com/react-data-grid/column-properties/) for the exhaustive list of column properties.

## `defaultColDef`

The `defaultColDef` prop allows you to define default properties for all columns. It is an object with the same properties as `columnDefs` objects.

In the example below, we enable flex mode on the columns, and set each column to take 1/3 of the available space:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    const defaultColDef = {
        flex: 1,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} defaultColDef={defaultColDef} />
        </List>
    );
};
```

![DatagridAG defaultColDef](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-PostList.png)

## `cellRenderer`

In a column definition, you can use the `cellRenderer` field to specify a custom cell renderer. In addition to [ag-grid's cell rendering abilities](https://www.ag-grid.com/react-data-grid/cell-rendering/), `<DatagridAG>` supports [react-admin fields](./Fields.md) in `cellRenderer`. This is particularly useful to render a [`<ReferenceField>`](./ReferenceField.md) for instance.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { EmailField, List, ReferenceField, TextField } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const CommentList = () => {
    const columnDefs = [
        {
            field: 'id',
            editable: false,
        },
        { field: 'author.name' },
        {
            field: 'author.email',
            cellRenderer: <EmailField source="author.email" />,
        },
        {
            field: 'post_id',
            headerName: 'Post',
            cellRenderer: (
                <ReferenceField source="post_id" reference="posts">
                    <TextField source="title" />
                </ReferenceField>
            ),
        },
        { field: 'created_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} />
        </List>
    );
};
```

![DatagridAG RA Fields](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-ra-fields.png)

**Note:** You still need to pass the `source` prop to the field.

## `bulkActionButtons`

You can use the `bulkActionButtons` prop to customize the bulk action buttons, displayed when at least one row is selected.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List, BulkExportButton, BulkDeleteButton } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const PostBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const PostList = () => {
    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            editable: false,
            minWidth: 48,
            maxWidth: 48,
        },
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                bulkActionButtons={<PostBulkActionButtons />}
            />
        </List>
    );
};
```

## `mutationOptions`

You can use the `mutationOptions` prop to provide options to the `dataProvider.update()` call triggered when a cell or a row is edited.

In particular, this allows to choose the [`mutationMode`](./Edit.md#mutationmode), and/or to pass a `meta` object to the dataProvider.

{% raw %}

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                mutationOptions={{
                    meta: { foo: 'bar' },
                    mutationMode: 'optimistic',
                }}
            />
        </List>
    );
};
```

{% endraw %}

This also allows to display a notification after the mutation succeeds.

{% raw %}

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List, useNotify } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    const notify = useNotify();
    const onSuccess = React.useCallback(() => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: {
                smart_count: 1,
            },
            undoable: true,
        });
    }, [notify]);
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                mutationOptions={{
                    mutationMode: 'undoable',
                    onSuccess,
                }}
            />
        </List>
    );
};
```

{% endraw %}

## `theme`

You can use a different theme for the grid by passing a `theme` prop. You can for instance use one of the [themes provided by ag-grid](https://www.ag-grid.com/react-data-grid/themes/), like `ag-theme-balham` or `ag-theme-alpine-dark`:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} theme="ag-theme-alpine-dark" />
        </List>
    );
};
```

![DatagridAG Dark](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-dark.png)

**Tip:** Remember to import the corresponding stylesheet (e.g. `ag-theme-balham[.min].css` for `ag-theme-balham`).

## `pagination`

Enable or disable the pagination controls at the bottom of the list. Defaults to `true`. 

Disabling the pagination switches the grid to [infinite pagination mode](#enabling-infinite-pagination): Users reveal new rows simply by scrolling down. This is fast even for large lists thanks to [ag-grid's DOM virtualization](https://www.ag-grid.com/react-data-grid/dom-virtualisation/).

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const CarList = () => {
    const columnDefs = [
        { field: 'make' },
        { field: 'model' },
        { field: 'price' },
    ];
    const defaultColDef = {
        flex: 1,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={false}
            />
        </List>
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-without-pagination.mp4" type="video/mp4"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-without-pagination.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>

### `preferenceKey`

`<DatagridAG>` will store the order and size of columns in the [Store](./Store.md), under the key `${resource}.ag-grid.params`.

If you wish to change the key used to store the columns order and size, you can pass a `preferenceKey` prop to `<DatagridAG>`.

```tsx
<List perPage={10000} pagination={false}>
    <DatagridAG columnDefs={columnDefs} preferenceKey="my-post-list" />
</List>
```

If, instead, you want to disable the persistence of the columns order and size, you can pass `false` to the `preferenceKey` prop:

```tsx
<List perPage={10000} pagination={false}>
    <DatagridAG columnDefs={columnDefs} preferenceKey={false} />
</List>
```

**Note:** Saving the columns size in the Store is disabled when using the [`flex` config](https://www.ag-grid.com/react-data-grid/column-sizing/#column-flex).

## `sx`

You can also use [the `sx` prop](./SX.md) to customize the grid's style:

{% raw %}

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                sx={{ '& .ag-header-cell-comp-wrapper': { color: 'red' } }}
            />
        </List>
    );
};
```

{% endraw %}

![DatagridAG sx](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-sx.png)

It can also be helpful to change the default grid's height (`calc(100vh - 96px - ${theme.spacing(1)})`):

{% raw %}

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        /* ... */
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                sx={{ height: 'calc(100vh - 250px)' }}
            />
        </List>
    );
};
```

{% endraw %}

![DatagridAG sx height](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-sx-height.png)

## Accessing The Grid And Column APIs

You can access the grid's `api` and `columnApi` by passing a `ref` to `<DatagridAG>`.

In this example, we use the `columnApi` to automatically resize all columns to fit their content on first render:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    const gridRef = React.useRef<AgGridReact>(null);
    const onFirstDataRendered = React.useCallback(() => {
        gridRef.current.columnApi.autoSizeAllColumns();
    }, []);
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                ref={gridRef}
                onFirstDataRendered={onFirstDataRendered}
            />
        </List>
    );
};
```

Check out the [Grid API](https://www.ag-grid.com/react-data-grid/grid-api/) and [Column API](https://www.ag-grid.com/react-data-grid/column-api/) documentations to learn more.

## Changing The Default Column Width

By default, ag-grid will render each column with a fixed size.

You can choose to enable flex mode by setting the `flex` prop either on the `columnDefs` or on the `defaultColDef`:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at', flex: 1 },
        { field: 'body' },
    ];
    const defaultColDef = {
        flex: 2,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} defaultColDef={defaultColDef} />
        </List>
    );
};
```

![DatagridAG flex](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-flex.png)

Alternatively, you can use the grid's `columnApi` to call `autoSizeAllColumns` to automatically resize all columns to fit their content:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    const gridRef = React.useRef<AgGridReact>(null);
    const onFirstDataRendered = React.useCallback(() => {
        gridRef.current.columnApi.autoSizeAllColumns();
    }, []);
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                ref={gridRef}
                onFirstDataRendered={onFirstDataRendered}
            />
        </List>
    );
};
```

![DatagridAG auto size](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-auto-size.png)

Check out the [Column Sizing](https://www.ag-grid.com/react-data-grid/column-sizing/) documentation for more information and more alternatives.

## Selecting Rows And Enabling Bulk Actions

Just like `<Datagrid>`, `<DatagridAG>` supports row selection and bulk actions.

Add a column with the following definition to enable row selection:

```js
{
    headerCheckboxSelection: true,
    checkboxSelection: true,
    editable: false,
    minWidth: 48,
    maxWidth: 48,
},
```

Below is an example with the `PostList` component:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            editable: false,
            minWidth: 48,
            maxWidth: 48,
        },
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} />
        </List>
    );
};
```

![DatagridAG selected rows](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-selected-rows.png)

Just like with `<Datagrid>`, you can customize the bulk actions by passing a [`bulkActionButtons`](./Datagrid.md#bulkactionbuttons) prop to `<DatagridAG>`.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List, BulkExportButton, BulkDeleteButton } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const PostBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const PostList = () => {
    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            editable: false,
            minWidth: 48,
            maxWidth: 48,
        },
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                bulkActionButtons={<PostBulkActionButtons />}
            />
        </List>
    );
};
```

## Enabling Infinite Pagination

By default, `<DatagridAG>` renders pagination controls at the bottom of the list. You can disable these controls to switch to an infinite pagination mode, where the grid shows the next rows on scroll. Thanks to [ag-grid's DOM virtualization](https://www.ag-grid.com/react-data-grid/dom-virtualisation/), this mode causes no performance problem.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-without-pagination.mp4" type="video/mp4"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-without-pagination.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>

To enable infinite pagination, set the `pagination` prop to `false`. 

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const CarList = () => {
    const columnDefs = [
        { field: 'make' },
        { field: 'model' },
        { field: 'price' },
    ];
    const defaultColDef = {
        flex: 1,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={false}
            />
        </List>
    );
};
```

If you have subscribed to the [Enterprise version of ag-grid](https://www.ag-grid.com/react-data-grid/licensing/), you can also add a [Status Bar](https://www.ag-grid.com/react-data-grid/status-bar/) to show the total number of rows.

![DatagridAG with status bar](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-status-bar.png)

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useMemo } from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';
import 'ag-grid-enterprise';

const CarList = () => {
    const statusBar = useMemo(() => {
        return {
            statusPanels: [
                {
                    statusPanel: 'agTotalAndFilteredRowCountComponent',
                    align: 'left',
                },
            ],
        };
    }, []);
    const columnDefs = [{ field: 'make' }, { field: 'model' }, { field: 'price' }];
    const defaultColDef = { flex: 1 };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={false}
                statusBar={statusBar}
            />
        </List>
    );
};
```

## Enabling Full Row Edition

By default, editing is enabled on cells, which means you can edit a cell by double-clicking on it, and it will trigger a call to the dataProvider's `update` function.

![DatagridAG edit cell](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-edit-cell.png)

However, if you'd like to update the full row at once instead, you can enable full row editing by passing `editType="fullRow"` to `<DatagridAG>`:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        /* ... */
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} editType="fullRow" />
        </List>
    );
};
```

![DatagridAG edit row](https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-edit-row.png)

## Disabling Cell Edition

Set `editable: false` in the definition of a column to disable the ability to edit its cells.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at', editable: false },
        { field: 'body' },
    ];
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG columnDefs={columnDefs} />
        </List>
    );
};
```

Alternatively, you can disable the ability to edit all cells by passing `editable: false` to the `defaultColDef`:

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

export const PostList = () => {
    const columnDefs = [
        { field: 'title' },
        { field: 'published_at' },
        { field: 'body' },
    ];
    const defaultColDef = {
        editable: false,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
            />
        </List>
    );
};
```

## Using AG Grid Enterprise

`<DatagridAG>` is also compatible with the [Enterprise version of ag-grid](https://www.ag-grid.com/react-data-grid/licensing/).

You can follow the instructions in the _Getting Started with AG Grid Enterprise_ section of the [Getting Started](https://www.ag-grid.com/react-data-grid/getting-started/) documentation to enable the Enterprise features.

Below is a short example of what you can achieve.

```tsx
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import React from 'react';
import { List } from 'react-admin';
import { DatagridAG } from '@react-admin/ra-datagrid-ag';

const OlympicWinnersList = () => {
    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            editable: false,
            minWidth: 48,
            maxWidth: 48,
        },
        { field: 'athlete' },
        { field: 'age' },
        { field: 'country' },
        { field: 'year' },
        { field: 'date' },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
    ];
    const gridRef = React.useRef<AgGridReact>(null);
    const onFirstDataRendered = React.useCallback(() => {
        gridRef.current.columnApi.autoSizeAllColumns();
    }, []);
    const defaultColDef = {
        enableRowGroup: true,
    };
    return (
        <List perPage={10000} pagination={false}>
            <DatagridAG
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                ref={gridRef}
                onFirstDataRendered={onFirstDataRendered}
                rowGroupPanelShow="always"
                groupSelectsChildren
            />
        </List>
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/DatagridAG-enterprise.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>
