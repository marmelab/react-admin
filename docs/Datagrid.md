---
layout: default
title: "The Datagrid Component"
---

# `<Datagrid>`

![The `<Datagrid>` component](./img/tutorial_post_list_less_columns.png)

The `Datagrid` component renders a list of records as a table. It is usually used as a descendant of the [`<List>`](List.md#list) and [`<ReferenceManyField>`](./ReferenceManyField.md) components. Outside these components, it must be used inside a `ListContext`.

## Usage

`<Datagrid>` renders as many columns as it receives `<Field>` children. It uses the field `label` as column header (or, for fields with no `label`, the field `source`).

```jsx
// in src/posts.js
import * as React from "react";
import { List, Datagrid, TextField, EditButton } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <EditButton />
        </Datagrid>
    </List>
);
```

You can find more advanced examples of `<Datagrid>` usage in the [demos](./Demos.md). 

**Tip**: To let users edit the content right in the datagrid, check [`<EditableDatagrid>`](./EditableDatagrid.md)<img class="icon" src="./img/premium.svg" />, an [Enterprise Edition](https://marmelab.com/ra-enterprise) component.

The `<Datagrid>` is an **iterator** component: it gets an array of records from the `ListContext`, and iterates to display each record in a row. Other examples of iterator component are [`<SimpleList>`](./SimpleList.md) and [`<SingleFieldList>`](./SingleFieldList.md).

## Props

| Prop | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | Required | Element | n/a | The list of `<Field>` components to render as columns. |
| `body` | Optional | Element | `<Datagrid Body>` | The component used to render the body of the table. |
| `bulkActionButtons` | Optional | Element | `<BulkDelete Button>` | The component used to render the bulk action buttons. |
| `empty` | Optional | Element | `<Empty>` | The component used to render the empty table. |
| `expand` | Optional | Element |  | The component used to render the expand panel for each row. |
| `expandSingle` | Optional | Boolean | `false` | Whether to allow only one expanded row at a time. |
| `header` | Optional | Element | `<Datagrid Header>` | The component used to render the table header. |
| `hover` | Optional | Boolean | `true` | Whether to highlight the row under the mouse. |
| `isRowExpandable` | Optional | Function | `() => true` | A function that returns whether a row is expandable. |
| `isRowSelectable` | Optional | Function | `() => true` | A function that returns whether a row is selectable. |
| `optimized` | Optional | Boolean | `false` | Whether to optimize the rendering of the table. |
| `rowClick` | Optional | mixed | | The action to trigger when the user clicks on a row.  |
| `rowStyle` | Optional | Function | | A function that returns the style to apply to a row. |
| `rowSx` | Optional | Function | | A function that returns the sx prop to apply to a row. |
| `size` | Optional | `'small'` or `'medium'` | `'small'` | The size of the table. |
| `sx` | Optional | Object | | The sx prop passed down to the Material UI `<Table>` element. |

Additional props are passed down to [the Material UI `<Table>` element](https://mui.com/material-ui/api/table/).

## `body`

By default, `<Datagrid>` renders its body using `<DatagridBody>`, an internal react-admin component. You can pass a custom component as the `body` prop to override that default. And by the way, `<DatagridBody>` has a `row` prop set to `<DatagridRow>` by default for the same purpose. `<DatagridRow>` receives the row `record`, the `resource`, and a copy of the `<Datagrid>` children. That means you can create custom `<Datagrid>` logic without copying several components from the react-admin source.

For instance, the `<Datagrid isRowSelectable>` prop allows to disable the selection checkbox for some records. To *hide* checkboxes instead of disabling them, you can override `<DatagridRow>` and `<DatagridBody>` as follows:

```jsx
// in src/PostList.js
import { Datagrid, DatagridBody, List, TextField, RecordContextProvider } from 'react-admin';
import { TableCell, TableRow, Checkbox } from '@mui/material';

const MyDatagridRow = ({ record, id, onToggleItem, children, selected, selectable }) => (
    <RecordContextProvider value={record}>
        <TableRow>
            {/* first column: selection checkbox */}
            <TableCell padding="none">
                {selectable && (
                     <Checkbox
                         checked={selected}
                         onClick={event => onToggleItem(id, event)}
                     />
                )}
            </TableCell>            
            {/* data columns based on children */}
            {React.Children.map(children, field => (
                <TableCell key={`${id}-${field.props.source}`}>
                    {field}
                </TableCell>
            ))}
        </TableRow>
    </RecordContextProvider>
);

const MyDatagridBody = props => <DatagridBody {...props} row={<MyDatagridRow />} />;
const MyDatagrid = props => <Datagrid {...props} body={<MyDatagridBody />} />;

const PostList = () => (
    <List>
        <MyDatagrid>
            <TextField source="title" />
            ...
        </MyDatagrid>
    </List>
)

export default PostList;
```

## `bulkActionButtons`

<video controls autoplay playsinline muted loop>
  <source src="./img/bulk-actions-toolbar.webm" type="video/webm"/>
  <source src="./img/bulk-actions-toolbar.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Bulk action buttons are buttons that affect several records at once, like mass deletion for instance. In the `<Datagrid>` component, the bulk actions toolbar appears when a user ticks the checkboxes in the first column of the table. The user can then choose a button from the bulk actions toolbar. By default, all Datagrids have a single bulk action button, the bulk delete button. You can add other bulk action buttons by passing a custom element as the `bulkActionButtons` prop of the `<Datagrid>` component:

```jsx
import { Button } from '@mui/material';
import { Datagrid, BulkDeleteButton } from 'react-admin';

import ResetViewsButton from './ResetViewsButton';

const PostBulkActionButtons = () => (
    <>
        <ResetViewsButton label="Reset Views" />
        {/* default bulk delete action */}
        <BulkDeleteButton />
    </>
);

export const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
        </Datagrid>
    </List>
);
```

**Tip**: React-admin provides four components that you can use in `bulkActionButtons`:

- [`<BulkDeleteButton>`](./Buttons.md#bulkdeletebutton) (enabled by default)
- [`<BulkExportButton>`](./Buttons.md#bulkexportbutton) to export only the selection
- [`<BulkUpdateButton>`](./Buttons.md#bulkupdatebutton) to immediately update the selection
- [`<BulkUpdateFormButton>`](./Buttons.md#bulkupdateformbutton) to display a form allowing to update the selection

**Tip**: You can also disable bulk actions altogether by passing `false` to the `bulkActionButtons` prop. In this case, the checkboxes column doesn't show up.

Bulk action button components can use the [`useListContext`](./useListContext.md) hook to get the elements they need to perform their job:

* `selectedIds`: the identifiers of the currently selected items.
* `resource`: the currently displayed resource (eg `posts`, `comments`, etc.)
* `filterValues`: the filter values. This can be useful if you want to apply your action on all items matching the filter.

Here is an example of custom bulk action button, which sets the `views` property of all posts to `0`:

```jsx
// in ./ResetViewsButton.js
import { VisibilityOff } from '@mui/icons-material';
import { BulkUpdateButton } from 'react-admin';

const views = { views: 0 };

const ResetViewsButton = () => (
    <BulkUpdateButton label="Reset Views" data={views} icon={<VisibilityOff/>} />
);

export default ResetViewsButton;
```

You can also implement the same `<ResetViewsButton>` behind a [confirmation dialog](./Confirm.md) by using the [`mutationMode`](./Edit.md#mutationmode) prop:

```diff
// in ./ResetViewsButton.js
const ResetViewsButton = () => (
    <BulkUpdateButton
        label="Reset Views"
        data={views}
        icon={VisibilityOff}
+       mutationMode="pessimistic"
    />
);
```

But let's say you need a customized bulkAction button. Here is an example leveraging the `useUpdateMany` hook, which sets the `views` property of all posts to `0`:

```jsx
// in ./CustomResetViewsButton.js
import {
    useListContext,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    Button,
} from 'react-admin';
import { VisibilityOff } from '@mui/icons-material';

const CustomResetViewsButton = () => {
    const { selectedIds } = useListContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll('posts');
    const [updateMany, { isLoading }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } },
        {
            onSuccess: () => {
                refresh();
                notify('Posts updated');
                unselectAll();
            },
            onError: error => notify('Error: posts not updated', { type: 'error' }),
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={isLoading}
            onClick={() => updateMany}
        >
            <VisibilityOff />
        </Button>
    );
};

export default CustomResetViewsButton;
```

But most of the time, bulk actions are mini-applications with a standalone user interface (in a Dialog). Here is the same `<CustomResetViewsAction>` implemented behind a confirmation dialog:

```jsx
// in ./CustomResetViewsButton.js
import { useState } from 'react';
import {
    Button,
    Confirm,
    useListContext,
    useUpdateMany,
    useNotify,
    useRefresh,
    useUnselectAll,
} from 'react-admin';

const CustomResetViewsButton = () => {
    const { selectedIds } = useListContext();
    const [open, setOpen] = useState(false);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll('posts');
    const [updateMany, { isLoading }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } },
        {
            onSuccess: () => {
                refresh();
                notify('Posts updated');
                unselectAll();
            },
            onError: error => notify('Error: posts not updated', { type: 'error' }),
        }
    );
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    const handleConfirm = () => {
        updateMany();
        setOpen(false);
    };

    return (
        <>
            <Button label="Reset Views" onClick={handleClick} />
            <Confirm
                isOpen={open}
                loading={isLoading}
                title="Update View Count"
                content="Are you sure you want to reset the views for these items?"
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </>
    );
};

export default CustomResetViewsButton;
```

**Tip**: [`<Confirm>`](./Confirm.md) leverages Material UI's `<Dialog>` component to implement a confirmation popup. Feel free to use it in your admins!

**Tip**: `<Confirm>` text props such as `title` and `content` are translatable. You can pass translation keys in these props. Note: `content` is only translatable when value is `string`, otherwise it renders the content as a `ReactNode`.

**Tip**: You can customize the text of the two `<Confirm>` component buttons using the `cancel` and `confirm` props which accept translation keys. You can customize the icons by setting the `ConfirmIcon` and `CancelIcon` props, which accept a [SvgIcon](https://mui.com/material-ui/icons/#svgicon) type.

**Tip**: React-admin doesn't use the `<Confirm>` component internally, because deletes and updates are applied locally immediately, then dispatched to the server after a few seconds, unless the user chooses to undo the modification. That's what we call optimistic rendering. You can do the same for the `<ResetViewsButton>` by setting `undoable: true` in the last argument of `useUpdateMany()`, as follows:

```diff
// in ./CustomResetViewsButton.js
import * as React from "react";
import {
    Button,
-   Confirm,
    useListContext,
    useUpdateMany,
-   useRefresh,
    useNotify,
    useUnselectAll,
} from 'react-admin';
import { VisibilityOff } from '@mui/icons-material';

const CustomResetViewsButton = () => {
    const { selectedIds } = useListContext();
-   const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll('posts');
    const [updateMany, { isLoading }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } },
        {
            onSuccess: () => {
-               refresh();
-               notify('Posts updated');
+               notify('Posts updated', { undoable: true }); // the last argument forces the display of 'undo' in the notification
                unselectAll();
            },
            onError: error => notify('Error: posts not updated', { type: 'error' }),
+           mutationMode: 'undoable'
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={isLoading}
            onClick={updateMany}
        >
            <VisibilityOff />
        </Button>
    );
};
```

## `children`

`<Datagrid>` accepts a list of Field components as children. It inspects each child's `source` and/or `label` props to determine the name of the column.

What's a Field component? Simply a component that reads the record (via `useRecordContext`) and renders a value. React-admin includes many Field components that you can use as children of `<Datagrid>` (`<TextField>`, `<NumberField>`, `<DateField>`, `<ReferenceField>`, and many more). Check [the Fields documentation](./Fields.md) for more information. 

You can even create your own field components.

```jsx
// in src/users.js
import * as React from 'react';
import { useRecordContext, List, Datagrid, TextField, DateField } from 'react-admin';

const FullNameField = () => {
    const record = useRecordContext();
    return <span>{record.firstName} {record.lastName}</span>;
}

export const UserList = () => (
    <List>
        <Datagrid rowclick="edit">
            <FullNameField source="last_name" label="Name" />
            <DateField source="dob" />
            <TextField source="city" />
        </Datagrid>
    </List>
);
```

`<Datagrid>` also inspects its children for `headerClassName` and `cellClassName` props, and gives the class names to the headers and the cells of that column. 

Finally, `<Datagrid>` inspects children for props that indicate how it should be sorted (see [the Customizing The Sort Order For Columns section](#customizing-column-sort)) below.

## `empty`

It's possible that a Datagrid will have no records to display. If the Datagrid's parent component does not handle the empty state, the Datagrid will display a message indicating there are no results. This message is translatable and its key is `ra.navigation.no_results`.

You can customize the empty state by passing  a component to the `empty` prop:

```jsx
const CustomEmpty = () => <div>No books found</div>;

const PostList = () => (
    <List>
        <Datagrid empty={<CustomEmpty />}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

## `expand`

<video controls autoplay playsinline muted loop>
  <source src="./img/datagrid_expand.webm" type="video/webm"/>
  <source src="./img/datagrid_expand.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


To show more data from the resource without adding too many columns, you can show data in an expandable panel below the row on demand, using the `expand` prop. 

For instance, this code shows the `body` of a post in an expandable panel:

{% raw %}
```jsx
import { useRecordContext } from 'react-admin';

const PostPanel = () => {
    const record = useRecordContext();
    return (
        <div dangerouslySetInnerHTML={{ __html: record.body }} />
    );
};

const PostList = () => (
    <List>
        <Datagrid expand={<PostPanel />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="commentable" />
            <EditButton />
        </Datagrid>
    </List>
)
```

The `expand` prop expects a React element as value. When the user chooses to expand the row, the Datagrid renders the component inside a `RecordContext`.

**Tip**: You can actually use a Show Layout component for the `expand` prop:

```jsx
const PostShow = () => (
    <SimpleShowLayout>
        <RichTextField source="body" />
    </SimpleShowLayout>
);

const PostList = () => (
    <List>
        <Datagrid expand={<PostShow />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="commentable" />
            <EditButton />
        </Datagrid>
    </List>
)
```

**Tip**: You can go one step further and use an `<Edit>` view as `expand` component:

```jsx
const PostEdit = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    return (
        <Edit
            resource={resource}
            id={record.id}
            /* disable the app title change when shown */
            title=" "
        >
            <SimpleForm>
                <RichTextInput source="body" />
            </SimpleForm>
        </Edit>
    );
};

const PostList = () => (
    <List>
        <Datagrid expand={<PostEdit />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="commentable" />
            <EditButton />
        </Datagrid>
    </List>
)
```

## `expandSingle`

By default, when using [an `expand` panel](#expand), users can expand as many rows as they want. The `expandSingle` prop changes that behavior: when a user clicks on the expand button of a row, other expanded rows collapse. As a consequence, only a single row can be expanded at a time.

```jsx
export const PostList = () => (
    <List>
        <Datagrid expand={<PostPanel />} expandSingle>
            ...
        </Datagrid>
    </List>
);
```


## `header`

By default, `<Datagrid>` renders the table head using `<DatagridHeader>`, an internal react-admin component. You can pass a custom component as the `header` prop to override that default. This can be useful e.g. to add a second header row, or to create headers spanning multiple columns.

For instance, here is a simple datagrid header that displays column names with no sort and no "select all" button:

```jsx
import { TableHead, TableRow, TableCell } from '@mui/material';

const DatagridHeader = ({ children }) => (
    <TableHead>
        <TableRow>
            <TableCell></TableCell> {/* empty cell to account for the select row checkbox in the body */}
            {Children.map(children, child => (
                <TableCell key={child.props.source}>
                    {child.props.source}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const PostList = () => (
    <List>
        <Datagrid header={<DatagridHeader />}>
            {/* ... */}
        </Datagrid>
    </List>
);
```

**Tip**: To handle sorting in your custom Datagrid header component, check out the [Building a custom sort control](./ListTutorial.md#building-a-custom-sort-control) section.

## `hover`

By default, the rows of the datagrid are highlighted when the user hovers over them. To disable this behavior, set the `hover` prop to `false`.

```jsx
const PostList = () => (
    <List>
        <Datagrid hover={false}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

## `isRowExpandable`

You can customize which rows can have an expandable panel by using the `isRowExpandable` prop. It expects a function that receives the row record and returns a boolean.

For instance, this code shows an expand button only for rows that have a detail to show:

```jsx
import { List, Datagrid, EditButton, BooleanField, DateField, TextField, useRecordContext } from 'react-admin';

const PostPanel = () => {
    const record = useRecordContext();
    return (
        <div dangerouslySetInnerHTML={{ __html: record.body }} />
    );
};

const PostList = () => (
    <List>
        <Datagrid 
            expand={<PostPanel />}
            isRowExpandable={row => row.has_detail}    
        >
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="commentable" />
            <EditButton />
        </Datagrid>
    </List>
)
```

## `isRowSelectable`

You can customize which rows show an enabled selection checkbox using the `isRowSelectable` prop. It expects a function that receives the row record and returns a boolean.

For instance, this code enables a checkbox only for rows with an id greater than 300:

```jsx
import { List, Datagrid } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid isRowSelectable={ record => record.id > 300 }>
            ...
        </Datagrid>
    </List>
);
```
{% endraw %}

## `optimized`

When displaying large pages of data, you might experience some performance issues.
This is mostly due to the fact that we iterate over the `<Datagrid>` children and clone them.

In such cases, you can opt-in for an optimized version of the `<Datagrid>` by setting its `optimized` prop to `true`. 
Be aware that you can't have dynamic children, such as those displayed or hidden by checking permissions, when using this mode.

```jsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid optimized>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

## `rowClick`

You can catch clicks on rows to redirect to the show or edit view by setting the `rowClick` prop:

```jsx
import { List, Datagrid } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid rowClick="edit">
            ...
        </Datagrid>
    </List>
);
```

`rowClick` accepts the following values:

* "edit" to redirect to the edition view
* "show" to redirect to the show view
* "expand" to open the `expand` panel
* "toggleSelection" to trigger the `onToggleItem` function
* `false` to do nothing
* a function `(id, resource, record) => path` that may return any of the above values or a custom path

**Tip**: If you pass a function, it can return `'edit'`, `'show'`, `false` or a router path. This allows to redirect to either the Edit or Show view after checking a condition on the record. For example:

```js
const postRowClick = (id, resource, record) => record.editable ? 'edit' : 'show';
```

**Tip**: If you pass a function, it can also return a promise allowing you to check an external API before returning a path. For example:

```js
import fetchUserRights from './fetchUserRights';

const getPermissions = useGetPermissions();
const postRowClick = (id, resource, record) => 
    useGetPermissions()
    .then(permissions => permissions === 'admin' ? 'edit' : 'show');
```

## `rowStyle`

*Deprecated - use [`rowSx`](#rowsx) instead.*

You can customize the `<Datagrid>` row style (applied to the `<tr>` element) based on the record, thanks to the `rowStyle` prop, which expects a function. React-admin calls this function for each row, passing the current record and index as arguments. The function should return a style object, which react-admin uses as a `<tr style>` prop. 

For instance, this allows to apply a custom background to the entire row if one value of the record - like its number of views - passes a certain threshold.

```jsx
import { List, Datagrid } from 'react-admin';

const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});
export const PostList = () => (
    <List>
        <Datagrid rowStyle={postRowStyle}>
            ...
        </Datagrid>
    </List>
);
```

## `rowSx`

You can customize the styles of rows and cells in `<Datagrid>` (applied to the `<DatagridRow>` element) based on the record, thanks to the `rowSx` prop, which expects a function. React-admin calls this function for each row, passing the current record and index as arguments. The function should return a Material UI [`sx`](https://mui.com/system/getting-started/the-sx-prop/), which react-admin uses as a `<TableRow sx>` prop. 

For instance, this allows to apply a custom background to the entire row if one value of the record - like its number of views - passes a certain threshold.

```jsx
import { List, Datagrid } from 'react-admin';

const postRowSx = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});
export const PostList = () => (
    <List>
        <Datagrid rowSx={postRowSx}>
            ...
        </Datagrid>
    </List>
);
```

## `size`

The `<Datagrid>` is designed for a high density of content, so the row padding is low. If you want to add more margin to each cell, set the `size` prop to `medium`.

```jsx
export const PostList = () => (
    <List>
        <Datagrid size="medium">
            ...
        </Datagrid>
    </List>
);
```

**Tip**: `size` is actually a prop of the Material UI `<Table>` component. Just like all additional `<Datagrid>` props, it is passed down to the `<Table>` component. 

## `sx`: CSS API

The `<Datagrid>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                      | Description                                      |
| ------------------------------ |--------------------------------------------------|
| `& .RaDatagrid-root`           | Applied to the root div element                  |
| `& .RaDatagrid-tableWrapper`   | Applied to the div that wraps table element      |
| `& .RaDatagrid-table`          | Applied to the table element                     |
| `& .RaDatagrid-thead`          | Applied to the table header                      |
| `& .RaDatagrid-tbody`          | Applied to the table body                        |
| `& .RaDatagrid-headerCell`     | Applied to each header cell                      |
| `& .RaDatagrid-headerRow`      | Applied to each header row                       |
| `& .RaDatagrid-row`            | Applied to each row                              |
| `& .RaDatagrid-rowEven`        | Applied to each even row                         |
| `& .RaDatagrid-rowOdd`         | Applied to each odd row                          |
| `& .RaDatagrid-rowCell`        | Applied to each row cell                         |
| `& .RaDatagrid-selectable`     | Applied to each selectable row                   |
| `& .RaDatagrid-expandHeader`   | Applied to each expandable header cell           |
| `& .RaDatagrid-clickableRow`   | Applied to each row if `rowClick` prop is truthy |
| `& .RaDatagrid-expandIconCell` | Applied to each expandable cell                  |
| `& .RaDatagrid-expandIcon`     | Applied to each expand icon                      |
| `& .RaDatagrid-expandable`     | Applied to each expandable row                   |
| `& .RaDatagrid-expanded`       | Applied to each expanded icon                    |
| `& .RaDatagrid-expandedPanel`  | Applied to each expandable panel                 |
| `& .RaDatagrid-checkbox`       | Applied to each checkbox cell                    |

For instance, here is how you can leverage these styles to implement zebra stripes (a.k.a. alternate row styles)

{% raw %}
```jsx
const PostList = () => (
    <List>
        <Datagrid
            sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#fee',
                },
            }}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);
```
{% endraw %}

**Tip**: `sx` is the standard for style customization in Material UI . Check [the sx documentation](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles) for more advanced usage.

**Tip**: The `Datagrid` component `classes` can also be customized for all instances of the component with its global css name `"RaDatagrid"` as [describe here](https://marmelab.com/blog/2019/12/18/react-admin-3-1.html#theme-overrides)

## Configurable

You can let end users customize the fields displayed in the `<Datagrid>` by using the `<DatagridConfigurable>` component instead.

<video controls autoplay playsinline muted loop>
  <source src="./img/DatagridConfigurable.webm" type="video/webm"/>
  <source src="./img/DatagridConfigurable.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


```diff
import {
    List,
-   Datagrid,
+   DatagridConfigurable,
    TextField,
} from 'react-admin';

const PostList = () => (
    <List>
-       <Datagrid>
+       <DatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
-       </Datagrid>
+       </DatagridConfigurable>
    </List>
);
```

When users enter the configuration mode and select the `<Datagrid>`, they can show / hide datagrid columns. They can also use the [`<SelectColumnsButton>`](./SelectColumnsButton.md)

By default, `<DatagridConfigurable>` renders all child fields. But you can also omit some of them by passing an `omit` prop containing an array of field sources:

```jsx
// by default, hide the id and author columns
// users can choose to show them in configuration mode
const PostList = () => (
    <List>
        <DatagridConfigurable omit={['id', 'author']}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </DatagridConfigurable>
    </List>
);
```

If you render more than one `<DatagridConfigurable>` in the same page, you must pass a unique `preferenceKey` prop to each one:

```jsx
const PostList = () => (
    <List>
        <DatagridConfigurable preferenceKey="posts.datagrid">
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </DatagridConfigurable>
    </List>
);
```

The inspector uses the field `source` (or `label` when it's a string) to display the column name. If you use non-field children (e.g. action buttons), then it's your responsibility to wrap them in a component with a `label` prop, that will be used by the inspector:

```jsx
const FieldWrapper = ({ children, label }) => children;
const PostList = () => (
    <List>
        <DatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
            <FieldWrapper label="Actions">
                <EditButton />
            </FieldWrapper>
        </DatagridConfigurable>
    </List>
);
```

`<DatagridConfigurable>` accepts the same props as `<Datagrid>`.

## Editable Spreadsheet

You can combine a datagrid and an edition form into a unified spreadsheet view, "à la" Excel. This is useful when you want to let users edit a large number of records at once.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-overview.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-editable-datagrid-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<EditableDatagrid>` is a drop-in replacement for `<Datagrid>`. It expects 2 additional props: `createForm` and `editForm`, the components to be displayed when a user creates or edits a row. The `<RowForm>` component allows to create such forms using react-admin Input components. 

```jsx
import {
    List,
    TextField,
    TextInput,
    DateField,
    DateInput,
    SelectField,
    SelectInput,
    required,
} from 'react-admin';
import { EditableDatagrid, RowForm } from '@react-admin/ra-editable-datagrid';

const professionChoices = [
    { id: 'actor', name: 'Actor' },
    { id: 'singer', name: 'Singer' },
    { id: 'other', name: 'Other' },
];

const ArtistList = () => (
    <List hasCreate empty={false}>
        <EditableDatagrid
            mutationMode="undoable"
            createForm={<ArtistForm />}
            editForm={<ArtistForm />}
        >
            <TextField source="id" />
            <TextField source="firstname" />
            <TextField source="name" />
            <DateField source="dob" label="born" />
            <SelectField
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </EditableDatagrid>
    </List>
);

const ArtistForm = () => (
    <RowForm>
        <TextField source="id" />
        <TextInput source="firstname" validate={required()} />
        <TextInput source="name" validate={required()} />
        <DateInput source="dob" label="born" validate={required()} />
        <SelectInput
            source="prof"
            label="Profession"
            choices={professionChoices}
        />
    </RowForm>
);
```

Check [the `ra-editable-datagrid` documentation](https://marmelab.com/ra-enterprise/modules/ra-editable-datagrid) for more details.

## Fields And Permissions

You might want to display some fields only to users with specific permissions. Use the `usePermissions` hook to get the user permissions and hide Fields accordingly:

{% raw %}
```jsx
import { List, Datagrid, TextField, TextInput, ShowButton, usePermissions } from 'react-admin';

const getUserFilters = (permissions) => ([
    <TextInput label="user.list.search" source="q" alwaysOn />,
    <TextInput source="name" />,
    permissions === 'admin' ? <TextInput source="role" /> : null,
    ].filter(filter => filter !== null)
);

export const UserList = ({ permissions, ...props }) => {
    const { permissions } = usePermissions();
    return (
        <List
            {...props}
            filters={getUserFilters(permissions)}
            sort={{ field: 'name', order: 'ASC' }}
        >
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                {permissions === 'admin' && <TextField source="role" />}
                {permissions === 'admin' && <EditButton />}
                <ShowButton />
            </Datagrid>
        </List>
    )
};
```
{% endraw %}

Note how the `permissions` prop is passed down to the custom `filters` component to allow Filter customization, too.

It's up to your `authProvider` to return whatever you need to check roles and permissions inside your component. Check [the authProvider documentation](./Authentication.md) for more information.

**Tip**: The [ra-rbac module](./AuthRBAC.md#datagrid) provides a wrapper for the `<Datagrid>` with built-in permission check for columns. 

## Standalone Usage

You can use the `<Datagrid>` component to display data that you've fetched yourself. You'll need to pass all the props required for its features:

```jsx
import { useGetList, Datagrid, TextField } from 'react-admin';

const sort = { field: 'id', order: 'DESC' };

const MyCustomList = () => {
    const { data, total, isLoading } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });

    return (
        <Datagrid
            data={data}
            total={total}
            isLoading={isLoading}
            sort={sort}
            bulkActionButtons={false}
        >
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    );
};
```

This list has no filtering, sorting, or row selection - it's static. If you want to allow users to interact with this list, you should pass more props to the `<Datagrid>` component, but the logic isn't trivial. Fortunately, react-admin provides [the `useList` hook](./useList.md) to build callbacks to manipulate local data. You just have to put the result in a `ListContext` to have an interactive `<Datagrid>`:

```jsx
import {
    useGetList,
    useList,
    ListContextProvider,
    Datagrid,
    TextField
} from 'react-admin';

const sort = { field: 'id', order: 'DESC' };

const MyCustomList = () => {
    const { data, isLoading } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });
    const listContext = useList({ data, isLoading });

    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
            </Datagrid>
        </ListContextProvider>
    );
};
```

## Styling Specific Columns

If you want to style a particular column, you can take advantage of the generated class names per column. For instance, for a column formed for a `<TextField source="title" />` both the column header and the cells will have the class `column-title`.

Using the `sx` prop, the column customization is just one line:

{% raw %}
```jsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid
            sx={{
                '& .column-title': { backgroundColor: '#fee' },
            }}
        >
            <TextField source="id" />
            <TextField source="title" /> {/* will have different background */}
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);
```
{% endraw %}

You can even style the header cells differently by passing a more specific CSS selector (e.g. `& tr.column-title`).

A common practice is to hide certain columns on smaller screens. You can use the same technique:

{% raw %}
```jsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid
            sx={{
                '& .column-title': {
                    sm: { display: 'none' },
                    md: { display: 'table-cell' },
                },
            }}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);
```
{% endraw %}

## Showing / Hiding Columns

The [`<SelectColumnsButton>`](./SelectColumnsButton.md) component lets users hide, show, and reorder datagrid columns. 

<video controls autoplay playsinline muted loop>
  <source src="./img/SelectColumnsButton.webm" type="video/webm"/>
  <source src="./img/SelectColumnsButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


```jsx
import {
    DatagridConfigurable,
    List,
    SelectColumnsButton,
    FilterButton,
    CreateButton,
    ExportButton,
    TextField,
    TopToolbar,
} from "react-admin";

const PostListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const PostList = () => (
    <List actions={<PostListActions />}>
        <DatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </DatagridConfigurable>
    </List>
);
```

`<SelectColumnsButton>` must be used in conjunction with `<DatagridConfigurable>`, the configurable version of `<Datagrid>`, described in the next section.

## Hiding Checkboxes

You can hide the checkbox column by passing `false` to the [`bulkActionButtons`](#bulkactionbuttons) prop:

```tsx
import { Datagrid, List } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={false}>
            ...
        </Datagrid>
    </List>
);
```

## Customizing Column Sort

<video controls autoplay playsinline muted loop>
  <source src="./img/sort-column-header.webm" type="video/webm"/>
  <source src="./img/sort-column-header.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The column headers are buttons allowing users to change the list sort field and order. This feature requires no configuration and works out fo the box. The next sections explain how you can disable or modify the field used for sorting on a particular column.

### Disabling Sorting

It is possible to disable sorting for a specific `<Field>` by passing a `sortable` property set to `false`:

{% raw %}
```jsx
// in src/posts.js
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" sortable={false} />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

### Specifying A Sort Field

By default, a column is sorted by the `source` property. To define another attribute to sort by, set it via the `<Field sortBy>` property:

{% raw %}
```jsx
// in src/posts.js
import { List, Datagrid, FunctionField, ReferenceField, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <ReferenceField label="Post" source="id" reference="posts" sortBy="title">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField
                label="Author"
                sortBy="last_name"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

### Specifying The Sort Order

By default, when the user clicks on a column header, the list becomes sorted in the ascending order. You change this behavior by setting the `sortByOrder` prop to `"DESC"` in a `<Datagrid>` `<Field>`:

```jsx
// in src/posts.js
import { List, Datagrid, FunctionField, ReferenceField, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <ReferenceField label="Post" source="id" reference="posts" sortByOrder="DESC">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField
                label="Author"
                sortBy="last_name"
                sortByOrder="DESC"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
