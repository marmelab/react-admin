---
layout: default
title: "The List View"
---

# The List View

The List view displays a list of records fetched from the API. The entry point for this view is the `<List>` component, which takes care of fetching the data. Then, it passes the data to an iterator view - usually `<Datagrid>`, which then delegates the rendering of each record property to [`<Field>`](./Fields.md) components.

![The List View](./img/list-view.png)

## The `<List>` Component

The `<List>` component renders the list layout (title, buttons, filters, pagination), and fetches the list of records from the REST API. It then delegates the rendering of the list of records to its child component. Usually, it's a `<Datagrid>`, responsible for displaying a table with one row for each post.

**Tip**: In Redux terms, `<List>` is a connected component, and `<Datagrid>` is a dumb component.

Here are all the props accepted by the `<List>` component:

* [`title`](#page-title)
* [`actions`](#actions)
* [`exporter`](#exporter)
* [`bulkActionButtons`](#bulk-action-buttons)
* [`filters`](#filters) (a React element used to display the filter form)
* [`perPage`](#records-per-page)
* [`sort`](#default-sort-field)
* [`filter`](#permanent-filter) (the permanent filter used in the REST request)
* [`filterDefaultValues`](#filter-default-values) (the default values for `alwaysOn` filters)
* [`pagination`](#pagination)
* [`aside`](#aside-component)
* [`empty`](#empty-page)

Here is the minimal code necessary to display a list of posts:

```jsx
// in src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;

// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```

That's enough to display the post list:

![Simple posts list](./img/simple-post-list.png)

### Page Title

The default title for a list view is "[resource] list" (e.g. "Posts list"). Use the `title` prop to customize the List view title:

```jsx
// in src/posts.js
export const PostList = (props) => (
    <List {...props} title="List of posts">
        ...
    </List>
);
```

The title can be either a string, or an element of your own.

### Actions

You can replace the list of default actions by your own element using the `actions` prop:

{% raw %}
```jsx
import React, { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    TopToolbar, CreateButton, ExportButton, Button, sanitizeListRestProps,
} from 'react-admin';
import IconEvent from '@material-ui/icons/Event';

const ListActions = ({
    currentSort,
    className,
    resource,
    filters,
    displayedFilters,
    exporter, // you can hide ExportButton if exporter = (null || false)
    filterValues,
    permanentFilter,
    hasCreate, // you can hide CreateButton if hasCreate = false
    basePath,
    selectedIds,
    onUnselectItems,
    showFilter,
    maxResults,
    total,
    ...rest
}) => (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filters && cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
        })}
        <CreateButton basePath={basePath} />
        <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={currentSort}
            filter={{ ...filterValues, ...permanentFilter }}
            exporter={exporter}
            maxResults={maxResults}
        />
        {/* Add your custom actions */}
        <Button
            onClick={() => { alert('Your custom action'); }}
            label="Show calendar"
        >
            <IconEvent />
        </Button>
    </TopToolbar>
);

ListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
};

export const PostList = (props) => (
    <List {...props} actions={<ListActions />}>
        ...
    </List>
);
```
{% endraw %}


You can also use such a custom `ListActions` prop to omit or reorder buttons based on permissions. Just pass the `permissions` down from the `List` component:

```jsx
export const PostList = ({ permissions, ...props }) => (
    <List {...props} actions={<PostActions permissions={permissions} {...props} />}>
        ...
    </List>
);
```

### Exporter

Among the default list actions, react-admin includes an `<ExportButton>`. This button is disabled when there is no record in the current `<List>`.

By default, clicking this button will:

1. Call the `dataProvider` with the current sort and filter (but without pagination),
2. Transform the result into a CSV string,
3. Download the CSV file.

The columns of the CSV file match all the fields of the records in the `dataProvider` response. That means that the export doesn't take into account the selection and ordering of fields in your `<List>` via `Field` components. If you want to customize the result, pass a custom `exporter` function to the `<List>`. This function will receive the data from the `dataProvider` (after step 1), and replace steps 2-3 (i.e. it's in charge of transforming, converting, and downloading the file).

**Tip**: For CSV conversion, you can import [jsonexport](https://github.com/kauegimenes/jsonexport#browser-import-examples), a CSV to JSON converter which is already a react-admin dependency. And for CSV download, take advantage of react-admin's `downloadCSV` function.

**Tip**: You may also remove the `<ExportButton>` by passing `false` to the `exporter` prop: `exporter={false}`

Here is an example for a Posts exporter, omitting, adding, and reordering fields:

```jsx
// in PostList.js
import { List, downloadCSV } from 'react-admin';
import jsonExport from 'jsonexport/dist';

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
})

const PostList = props => (
    <List {...props} exporter={exporter}>
        ...
    </List>
)
```

In many cases, you'll need more than simple object manipulation. You'll need to *augment* your objects based on relationships. For instance, the export for comments should include the title of the related post - but the export only exposes a `post_id` by default. For that purpose, the exporter receives a `fetchRelatedRecords` function as second parameter. It fetches related records using your `dataProvider` and the `GET_MANY` verb, and returns a promise.

Here is an example for a Comments exporter, fetching related Posts:

```jsx
// in CommentList.js
import { List, downloadCSV } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = (records, fetchRelatedRecords) => {
    // will call dataProvider(GET_MANY, 'posts', { ids: records.map(record => record.post_id) }), ignoring duplicate and empty post_id
    fetchRelatedRecords(records, 'post_id', 'posts').then(posts => {
        const data = records.map(record => ({
                ...record,
                post_title: posts[record.post_id].title,
        }));
        jsonExport(data, {
            headers: ['id', 'post_id', 'post_title', 'body'],
        }, (err, csv) => {;
            downloadCSV(csv, 'comments');
        });
    });
};

const CommentList = props => (
    <List {...props} exporter={exporter}>
        ...
    </List>
)
```

**Tip**: If you need to call another verb in the exporter, take advantage of the third parameter passed to the function: it's the `dataProvider` function.

**Tip**: The `<ExportButton>` limits the main request to the `dataProvider` to 1,000 records. If you want to increase or decrease this limit, pass a `maxResults` prop to the `<ExportButton>` in a custom `<ListActions>` component, as explained in the previous section.

**Tip**: React-admin also provides a `<BulkExportButton>` component that depends on the `exporter`, and that you can use in the `bulkActionButtons` prop of the `<List>` component.

**Tip**: For complex (or large) exports, fetching all the related records and assembling them client-side can be slow. In that case, create the CSV on the server side, and replace the `<ExportButton>` component by a custom one, fetching the CSV route.

### Bulk Action Buttons

Bulk action buttons are buttons that affect several records at once, like mass deletion for instance. In the `<Datagrid>` component, the bulk actions toolbar appears when a user ticks the checkboxes in the first column of the table. The user can then choose a button from the bulk actions toolbar. By default, all list views have a single bulk action button, the bulk delete button. You can add other bulk action buttons by passing a custom element as the `bulkActionButtons` prop of the `<List>` component:

```jsx
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { BulkDeleteButton } from 'react-admin';
import ResetViewsButton from './ResetViewsButton';

const PostBulkActionButtons = props => (
    <Fragment>
        <ResetViewsButton label="Reset Views" {...props} />
        {/* default bulk delete action */}
        <BulkDeleteButton {...props} />
    </Fragment>
);

export const PostList = (props) => (
    <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
        ...
    </List>
);
```

![Bulk Action Buttons](./img/bulk-actions-toolbar.gif)

**Tip**: React-admin provides 2 components that you can use in `bulkActionButtons`: `<BulkDeleteButton>`, and `<BulkExportButton>`.

**Tip**: You can also disable bulk actions altogether by passing `false` to the `bulkActionButtons` prop. When using a `Datagrid` inside a `List` with disabled bulk actions, the checkboxes column won't be added.

Bulk action button components receive several props allowing them to perform their job:

* `resource`: the currently displayed resource (eg `posts`, `comments`, etc.)
* `basePath`: the current router base path for the resource (eg `/posts`, `/comments`, etc.)
* `filterValues`: the filter values. This can be useful if you want to apply your action on all items matching the filter.
* `selectedIds`: the identifiers of the currently selected items.

Here is an example leveraging the `useUpdateMany` hook, which sets the `views` property of all posts to `0`:

```jsx
// in ./ResetViewsButton.js
import React from 'react';
import {
    Button,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
} from 'react-admin';

const ResetViewsButton = ({ selectedIds }) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
        'posts',
        selectedIds,
        { views: 0 },
        {
            onSuccess: () => {
                refresh();
                notify('Posts updated');
                unselectAll(resource);
            },
            onFailure: error => notify('Error: posts not updated', 'warning'),
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={loading}
            onClick={updateMany}
        >
            <VisibilityOff />
        </Button>
    );
};

export default ResetViewsButton;
```

But most of the time, bulk actions are mini-applications with a standalone user interface (in a Dialog). Here is the same `ResetViewsAction` implemented behind a confirmation dialog:

```jsx
// in ./ResetViewsButton.js
import React, { Fragment, useState } from 'react';
import {
    Button,
    Confirm,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
} from 'react-admin';

const ResetViewsButton = ({ selectedIds }) => {
    const [open, setOpen] = useState(false);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
        'posts',
        selectedIds,
        { views: 0 },
        {
            onSuccess: () => {
                refresh();
                notify('Posts updated');
                unselectAll(resource);
            },
            onFailure: error => notify('Error: posts not updated', 'warning'),
        }
    );
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    const handleConfirm = () => {
        updateMany();
        setOpen(false);
    };

    return (
        <Fragment>
            <Button label="Reset Views" onClick={handleClick} />
            <Confirm
                isOpen={open}
                loading={loading}
                title="Update View Count"
                content="Are you sure you want to reset the views for these items?"
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
}

export default ResetViewsButton;
```

**Tip**: `<Confirm>` leverages material-ui's `<Dialog>` component to implement a confirmation popup. Feel free to use it in your admins!

**Tip**: `<Confirm>` text props such as `title` and `content` are translatable. You can pass use translation keys in these props.

**Tip**: You can customize the text of the two `<Confirm>` component buttons using the `cancel` and `confirm` props which accept translation keys. You can customize the icons by setting the `ConfirmIcon` and `CancelIcon` props, which accept a SvgIcon type.

**Tip**: React-admin doesn't use the `<Confirm>` component internally, because deletes and updates are applied locally immediately, then dispatched to the server after a few seconds, unless the user chooses to undo the modification. That's what we call optimistic rendering. You can do the same for the `ResetViewsButton` by setting `undoable: true` in the last argument of `useUpdateMany()`, as follows:

```diff
// in ./ResetViewsButton.js
const ResetViewsButton = ({ selectedIds }) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const [updateMany, { loading }] = useUpdateMany(
        'posts',
        selectedIds,
        { views: 0 },
        {
            onSuccess: () => {
                refresh();
-               notify('Posts updated');
+               notify('Posts updated', 'info', '{}, true); // the last argument forces the display of 'undo' in the notification
                unselectAll(resource);
            },
            onFailure: error => notify('Error: posts not updated', 'warning'),
+           undoable: true
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={loading}
            onClick={updateMany}
        >
            <VisibilityOff />
        </Button>
    );
};
```

### Filters

You can add a filter component to the list using the `filters` prop:

```jsx
const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Title" source="title" defaultValue="Hello, World!" />
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filters={<PostFilter />}>
        ...
    </List>
);
```

The filter component must be a `<Filter>` with `<Input>` children.

**Tip**: `<Filter>` is a special component, which renders in two ways:

* as a filter button (to add new filters)
* as a filter form (to enter filter values)

It does so by inspecting its `context` prop.

**Tip**: Don't mix up this `filters` prop, expecting a React element, with the `filter` props, which expects an object to define permanent filters (see below).

The `Filter` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `classes` property (as most Material UI components, see their [documentation about it](https://material-ui.com/customization/components/#overriding-styles-with-classes)). This property accepts the following keys:

* `form`: applied to the root element when rendering as a form.
* `button`: applied to the root element when rendering as a button.

Children of the `<Filter>` form are regular inputs. `<Filter>` hides them all by default, except those that have the `alwaysOn` prop.

**Tip**: For technical reasons, react-admin does not accept children of `<Filter>` having both a `defaultValue` and `alwaysOn`. To set default values for always on filters, use the `filterDefaultValues` prop of the `<List>` component instead (see below).

### Records Per Page

By default, the list paginates results by groups of 10. You can override this setting by specifying the `perPage` prop:

```jsx
// in src/posts.js
export const PostList = (props) => (
    <List {...props} perPage={25}>
        ...
    </List>
);
```

### Default Sort Field

Pass an object literal as the `sort` prop to determine the default `field` and `order` used for sorting:

{% raw %}
```jsx
// in src/posts.js
export const PostList = (props) => (
    <List {...props} sort={{ field: 'published_at', order: 'DESC' }}>
        ...
    </List>
);
```
{% endraw %}

`sort` defines the *default* sort order ; the list remains sortable by clicking on column headers.

### Disabling Sorting

It is possible to disable sorting for a specific field by passing a `sortable` property set to `false`:

{% raw %}
```jsx
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" sortable={false} />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

### Specify Sort Field

By default, a column is sorted by the `source` property. To define another attribute to sort by, set it via the `sortBy` property:

{% raw %}
```jsx
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
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

### Permanent Filter

You can choose to always filter the list, without letting the user disable this filter - for instance to display only published posts. Write the filter to be passed to the REST client in the `filter` props:

{% raw %}
```jsx
// in src/posts.js
export const PostList = (props) => (
    <List {...props} filter={{ is_published: true }}>
        ...
    </List>
);
```
{% endraw %}

The actual filter parameter sent to the REST client is the result of the combination of the *user* filters (the ones set through the `filters` component form), and the *permanent* filter. The user cannot override the permanent filters set by way of `filter`.

### Filter Default Values

To set default values to filters, you can either pass an object literal as the `filterDefaultValues` prop of the `<List>` element, or use the `defaultValue` prop of any input component.

There is one exception: inputs with `alwaysOn` don't accept `defaultValue`. You have to use the `filterDefaultValues` for those.

{% raw %}
```jsx
// in src/posts.js
const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <BooleanInput source="is_published" alwaysOn />
        <TextInput source="title" defaultValue="Hello, World!" />
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filters={<PostFilter />} filterDefaultValues={{ is_published: true }}>
        ...
    </List>
);
```
{% endraw %}

**Tip**: The `filter` and `filterDefaultValues` props have one key difference: the `filterDefaultValues` can be overridden by the user, while the `filter` values are always sent to the data provider. Or, to put it otherwise:

```js
const filterSentToDataProvider = { ...filterDefaultValues, ...filterChosenByUser, ...filters };
```

### Aside component

You may want to display additional information on the side of the list. Use the `aside` prop for that, passing the component of your choice:

{% raw %}
```jsx
const Aside = () => (
    <div style={{ width: 200, margin: '1em' }}>
        <Typography variant="h6">Post details</Typography>
        <Typography variant="body2">
            Posts will only be published one an editor approves them
        </Typography>
    </div>
);

const PostList = props => (
    <List aside={<Aside />} {...props}>
        ...
    </List>
);
```
{% endraw %}

The `aside` component receives the same props as the `List` child component, including the following:

* `basePath`,
* `currentSort`,
* `data`,
* `defaultTitle`,
* `filterValues`,
* `ids`,
* `page`,
* `perPage`,
* `resource`,
* `selectedIds`,
* `total`,
* `version`,

That means you can display additional details of the current list in the aside component:

{% raw %}
```jsx
const Aside = ({ data, ids }) => (
    <div style={{ width: 200, margin: '1em' }}>
        <Typography variant="h6">Posts stats</Typography>
        <Typography variant="body2">
            Total views: {ids.map(id => data[id]).reduce((sum, post) => sum + post.views, 0)}
        </Typography>
    </div>
);
```
{% endraw %}

### Empty page

When there is no result, and there is no active filter, and the resource has a create page, react-admin displays a special page inviting the user to create the first record.

You can use the `empty` prop to replace that page by a custom component:

{% raw %}
```jsx
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CreateButton, List } from 'react-admin';

const Empty = ({ basePath, resource }) => (
    <Box textAlign="center" m={1}>
        <Typography variant="h4" paragraph>
            No products available
        </Typography>
        <Typography variant="body1">
            Create one or import from a file
        </Typography>
        <CreateButton basePath={basePath} />
        <Button onClick={...}>Import</Button>
    </Box>
);

const ProductList = props => (
    <List empty={<Empty />} {...props}>
        ...
    </List>
);
```
{% endraw %}

The `empty` component receives the same props as the `List` child component, including the following:

-   `basePath`,
-   `currentSort`,
-   `data`,
-   `defaultTitle`,
-   `filterValues`,
-   `ids`,
-   `page`,
-   `perPage`,
-   `resource`,
-   `selectedIds`,
-   `total`,
-   `version`,

### Component

By default, the List view renders the main content area inside a material-ui `<Card>` element. The actual layout of the list depends on the child component you're using (`<Datagrid>`, `<SimpleList>`, or a custom layout component).

Some layouts also use `Card`, in which case the user ends up seeing a card inside a card, which is bad UI. To avoid that, you can override the main area container by passing a `component` prop:

```jsx
// use a div as root component
const PostList = props => (
    <List component="div" {...props}>
        ...
    </List>
);

// use a custom component as root component 
const PostList = props => (
    <List component={MyComponent} {...props}>
        ...
    </List>
);
```

The default value for the `component` prop is `Card`.

### CSS API

The `List` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `classes` property (as most Material UI components, see their [documentation about it](https://material-ui.com/customization/components/#overriding-styles-with-classes)). This property accepts the following keys:

* `root`: alternative to using `className`. Applied to the root element.
* `header`: applied to the page header
* `actions`: applied to the actions container
* `noResults`: applied to the component shown when there is no result

Here is an example of how you can override some of these classes:

You can customize the list styles by passing a `classes` object as prop, through `useStyles()`. Here is an example:

{% raw %}
```jsx
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    header: {
        backgroundColor: '#ccc',
    },
});

const PostList = props => {
    const classes = useStyles();
    return (
        <List {...props} classes={{ header: classes.header }}>
            <Datagrid>
                ...
            </Datagrid>
        </List>
    );
}

export PostList;
```
{% endraw %}

## The `<ListGuesser>` component

Instead of a custom `List`, you can use the `ListGuesser` to determine which fields to use based on the data returned by the API.

```jsx
// in src/App.js
import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const App = () => (
    <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={ListGuesser} />
    </Admin>
);
```

Just like `List`, `ListGuesser` fetches the data. It then analyzes the response, and guesses the fields it should use to display a basic `Datagrid` with the data. It also dumps the components it has guessed in the console, where you can copy it into your own code. Use this feature to quickly bootstrap a `List` on top of an existing API, without adding the fields one by one.

![Guessed List](./img/guessed-list.png)

React-admin provides guessers for the `List` view (`ListGuesser`), the `Edit` view (`EditGuesser`), and the `Show` view (`ShowGuesser`).

**Tip**: Do not use the guessers in production. They are slower than manually-defined components, because they have to infer types based on the content. Besides, the guesses are not always perfect.

## The `<Datagrid>` component

The `Datagrid` component renders a list of records as a table. It is usually used as a child of the [`<List>`](#the-list-component) and [`<ReferenceManyField>`](./Fields.md#referencemanyfield) components.

Here are all the props accepted by the component:

* [`body`](#body-element)
* [`rowStyle`](#row-style-function)
* [`rowClick`](#rowclick)
* [`expand`](#expand)
* [`isRowSelectable`](#isrowselectable)

It renders as many columns as it receives `<Field>` children.

```jsx
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField, EditButton } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <EditButton />
        </Datagrid>
    </List>
);
```

The `Datagrid` is an *iterator* component: it receives an array of ids, and a data store, and is supposed to iterate over the ids to display each record. Another example of iterator component is [`<SingleFieldList>`](#the-singlefieldlist-component).

### Body element

By default, `<Datagrid>` renders its body using `<DatagridBody>`, an internal react-admin component. You can pass a custom component as the `row` prop to override that default. And by the way, `<DatagridBody>` has a `row` property set to `<DatagridRow>` by default for the same purpose. `<DatagridRow>` receives the row `record`, the `resource`, and a copy of the `<Datagrid>` children. That means you can create custom datagrid logic without copying several components from the react-admin source.

For instance, to show the selection checkbox only for records that have a `selectable` field set to `true`, you can override `<DatagridRow>` and `<DatagridBody>` as follows:

```jsx
// in src/PostList.js
import React from 'react';
import { Datagrid, DatagridBody, List, TextField } from 'react-admin';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const MyDatagridRow = ({ record, resource, id, onToggleItem, children, selected, basePath }) => (
    <TableRow key={id}>
        {/* first column: selection checkbox */}
        <TableCell padding="none">
            {record.selectable && <Checkbox
                checked={selected}
                onClick={() => onToggleItem(id)}
            />}
        </TableCell>
        {/* data columns based on children */}
        {React.Children.map(children, field => (
            <TableCell key={`${id}-${field.props.source}`}>
                {React.cloneElement(field, {
                    record,
                    basePath,
                    resource,
                })}
            </TableCell>
        ))}
    </TableRow>
);

const MyDatagridBody = props => <DatagridBody {...props} row={<MyDatagridRow />} />;
const MyDatagrid = props => <Datagrid {...props} body={<MyDatagridBody />} />;

const PostList = props => (
    <List {...props}>
        <MyDatagrid>
            <TextField source="title" />
            ...
        </MyDatagrid>
    </List>
)

export default PostList;
```

### Row Style Function

You can customize the `<Datagrid>` row style (applied to the `<tr>` element) based on the record, thanks to the `rowStyle` prop, which expects a function.

For instance, this allows to apply a custom background to the entire row if one value of the record - like its number of views - passes a certain threshold.

```jsx
const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});
export const PostList = (props) => (
    <List {...props}>
        <Datagrid rowStyle={postRowStyle}>
            ...
        </Datagrid>
    </List>
);
```

### `rowClick`

You can catch clicks on rows to redirect to the show or edit view by setting the `rowClick` prop:

```jsx
export const PostList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            ...
        </Datagrid>
    </List>
);
```

`rowClick` accepts the following values:

* "edit" to redirect to the edition vue
* "show" to redirect to the show vue
* "expand" to open the `expand` panel
* "toggleSelection" to trigger the `onToggleItem` function
* a function `(id, basePath, record) => path` to redirect to a custom path

**Tip**: If you pass a function, it can return `edit`, `show` or a router path. This allows to redirect to either `edit` or `show` after checking a condition on the record. For example:

```js
const postRowClick = (id, basePath, record) => record.editable ? 'edit' : 'show';
```

**Tip**: If you pass a function, it can also return a promise allowing you to check an external API before returning a path. For example:

```js
import fetchUserRights from './fetchUserRights';

const postRowClick = (id, basePath, record) => fetchUserRights().then(({ canEdit }) => canEdit ? 'edit' : 'show');
```

### `expand`

To show more data from the resource without adding too many columns, you can show data in an expandable panel below the row on demand, using the `expand` prop. For instance, this code shows the `body` of a post in an expandable panel:

{% raw %}
```jsx
const PostPanel = ({ id, record, resource }) => (
    <div dangerouslySetInnerHTML={{ __html: record.body }} />
);

const PostList = props => (
    <List {...props}>
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

### `isRowSelectable`

You can customize which rows will show a selection checkbox using the `isRowSelectable` prop. It expects a function that will receive the record of each `<DatagridRow>` and returns a boolean expression.  For instance, this code shows a checkbox only for rows with an id greater than 300:

```jsx
export const PostList = props => (
    <List {...props}>
        <Datagrid isRowSelectable={ record => record.id > 300 }>
            ...
        </Datagrid>
    </List>
);
```
{% endraw %}

![expandable panel](./img/datagrid_expand.gif)

The `expand` prop expects an component as value. When the user chooses to expand the row, the Datagrid render the component, and passes the current `record`, `id`, and `resource`.

**Tip**: Since the `expand` element receives the same props as a detail view, you can actually use a `<Show>` view as component for the `expand` prop:

```jsx
const PostShow = props => (
    <Show
        {...props}
        /* disable the app title change when shown */
        title=" "
    >
        <SimpleShowLayout>
            <RichTextField source="body" />
        </SimpleShowLayout>
    </Show>
);

const PostList = props => (
    <List {...props}>
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

The result will be the same as in the previous snippet, except that `<Show>` encloses the content inside a material-ui `<Card>`.

**Tip**: You can go one step further and use an `<Edit>` view as `expand` component, albeit with a twist:

```jsx
const PostEdit = props => (
    <Edit
        {...props}
        /* disable the app title change when shown */
        title=" "
    >
        <SimpleForm
            /* The form must have a name dependent on the record, because by default all forms have the same name */
            form={`post_edit_${props.id}`}
        >
            <RichTextInput source="body" />
        </SimpleForm>
    </Edit>
);

const PostList = props => (
    <List {...props}>
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

### CSS API

The `Datagrid` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `classes` property (as most Material UI components, see their [documentation about it](https://material-ui.com/customization/components/#overriding-styles-with-classes)). This property accepts the following keys:

* `table`: alternative to using `className`. Applied to the root element.
* `tbody`: applied to the tbody
* `headerCell`: applied to each header cell
* `row`: applied to each row
* `rowEven`: applied to each even row
* `rowOdd`: applied to each odd row
* `rowCell`: applied to each row cell

Here is an example of how you can override some of these classes:

You can customize the `<Datagrid>` styles by passing a `classes` object as prop, through `useStyles()`. Here is an example:

{% raw %}
```jsx
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    row: {
        backgroundColor: '#ccc',
    },
});

const PostList = props => {
    const classes = useStyles();
    return (
        <List {...props}>
            <Datagrid classes={{ row: classes.row }}>
                ...
            </Datagrid>
        </List>
    );
}

export PostList;
```
{% endraw %}

**Tip**: If you want to override the `header` and `cell` styles independently for each column, use the `headerClassName` and `cellClassName` props in `<Field>` components. For instance, to hide a certain column on small screens:

```jsx
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    hiddenOnSmallScreens: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
}));

const PostList = props => {
    const classes = useStyles();
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField
                    source="views"
                    headerClassName={classes.hiddenOnSmallScreens}
                    cellClassName={classes.hiddenOnSmallScreens}
                />
            </Datagrid>
        </List>
    );
};

export default PostList;
```

This feature has a limit, though. `Datagrid` inspects its children for `headerClassName` and `cellClassName` props. This means you can't use these props in a *wrapped* component:

```jsx
const useStyles = makeStyles({
    priceCell: { backgroundColor: 'blue' },
});

const PriceField = props => {
    const classes = useStyles();
    return <TextField cellClassName={classes.priceCell} {...props} />;
};

// the cell class name won't be applied here because Datagrid doesn't see it in its children
export const ProductList = (props) => (
    <List {...props}>
        <Datagrid>
            <PriceField source="price" />
        </Datagrid>
    </List>
);
```

For this kind of use case, you need to use a [custom datagrid body component](#body-element).

### Performance

when displaying large pages of data, you might experience some performance issues.
This is mostly due to the fact that we iterate over the `<Datagrid>` children and clone them.

In such cases, you can opt-in for an optimized version of the `<Datagrid>` by setting its `optimized` prop to `true`. 
Be aware that you can't have dynamic children, such as those displayed or hidden by checking permissions, when using this mode.

```jsx
const PostList = props => (
    <List {...props}>
        <Datagrid optimized>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);

export default withStyles(styles)(PostList);
```

**Tip**: You can use the `Datagrid` component with [custom queries](./Actions.md#usequery-hook):

{% raw %}
```jsx
import keyBy from 'lodash/keyBy'
import { useQuery, Datagrid, TextField, Pagination, Loading } from 'react-admin'

const CustomList = () => {
    const [page, setPage] = useState(1);
    const perPage = 50;
    const { data, total, loading, error } = useQuery({
        type: 'GET_LIST'
        resource: 'posts'
        payload: {
            pagination: { page, perPage },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
        }
    });

    if (loading) {
        return <Loading />
    }
    if (error) {
        return <p>ERROR: {error}</p>
    }
    return (
        <>
            <Datagrid
                data={keyBy(data, 'id')}
                ids={data.map(({ id }) => id)}
                currentSort={{ field: 'id', order: 'ASC' }}
                basePath="/posts" // required only if you set use "rowClick"
                rowClick="edit"
            >
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
            <Pagination
                page={page}
                perPage={perPage}
                setPage={setPage}
                total={total}
            />
        </>
    )
}
```
{% endraw %}

## The `<SimpleList>` component

For mobile devices, a `<Datagrid>` is often unusable - there is simply not enough space to display several columns. The convention in that case is to use a simple list, with only one column per row. The `<SimpleList>` component serves that purpose, leveraging [material-ui's `<List>` and `<ListItem>` components](https://material-ui.com/components/lists/). You can use it as `<List>` or `<ReferenceManyField>` child:

```jsx
// in src/posts.js
import React from 'react';
import { List, SimpleList } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
        />
    </List>
);
```

`<SimpleList>` iterates over the list data. For each record, it executes the `primaryText`, `secondaryText`, `leftAvatar`, `leftIcon`, `rightAvatar`, and `rightIcon` props function, and passes the result as the corresponding `<ListItem>` prop.

**Tip**: To use a `<SimpleList>` on small screens and a `<Datagrid>` on larger screens, use material-ui's `useMediaQuery` hook:

```jsx
// in src/posts.js
import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { List, SimpleList, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export const PostList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                <Datagrid>
                    ...
                </Datagrid>
            )}
        </List>
    );
}
```

**Tip**: The `<SimpleList>` items link to the edition page by default. You can set the `linkType` prop to `show` to link to the `<Show>` page instead.

```jsx
// in src/posts.js
import React from 'react';
import { List, SimpleList } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
            linkType="show"
        />
    </List>
);
```

Setting the `linkType` prop to `false` (boolean, not string) removes the link in all list items.

## The `<SingleFieldList>` component

When you want to display only one property of a list of records, instead of using a `<Datagrid>`, use the `<SingleFieldList>`. It expects a single `<Field>` as child. It's especially useful for `<ReferenceManyField>` or `<ReferenceArrayField>` components:

```jsx
// Display all the tags for the current post
<ReferenceArrayField
    label="Tags"
    reference="tags"
    source="tags"
>
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceArrayField>
```

![ReferenceManyFieldSingleFieldList](./img/reference-many-field-single-field-list.png)

**Tip**: The `<SingleFieldList>` items link to the edition page by default. You can set the `linkType` prop to `show` to link to the `<Show>` page instead.

```jsx
// Display all the tags for the current post
<ReferenceArrayField
    label="Tags"
    reference="tags"
    source="tags"
>
    <SingleFieldList linkType="show">
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceArrayField>
```

## Using a Custom Iterator

A `<List>` can delegate to any iterator component - `<Datagrid>` is just one example. An iterator component must accept at least two props:

- `ids` is an array of the ids currently displayed in the list
- `data` is an object of all the fetched data for this resource, indexed by id.

For instance, what if you prefer to show a list of cards rather than a datagrid?

![Custom iterator](./img/custom-iterator.png)

You'll need to create your own iterator component as follows:

{% raw %}
```jsx
// in src/comments.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/core/Avatar';
import { List, TextField, DateField, ReferenceField, EditButton } from "react-admin";

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
const CommentGrid = ({ ids, data, basePath }) => (
    <div style={{ margin: '1em' }}>
    {ids.map(id =>
        <Card key={id} style={cardStyle}>
            <CardHeader
                title={<TextField record={data[id]} source="author.name" />}
                subheader={<DateField record={data[id]} source="created_at" />}
                avatar={<Avatar icon={<PersonIcon />} />}
            />
            <CardContent>
                <TextField record={data[id]} source="body" />
            </CardContent>
            <CardContent>
                about&nbsp;
                <ReferenceField label="Post" resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath}>
                    <TextField source="title" />
                </ReferenceField>
            </CardContent>
            <CardActions style={{ textAlign: 'right' }}>
                <EditButton resource="posts" basePath={basePath} record={data[id]} />
            </CardActions>
        </Card>
    )}
    </div>
);
CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

export const CommentList = (props) => (
    <List title="All comments" {...props}>
        <CommentGrid />
    </List>
);
```
{% endraw %}

As you can see, nothing prevents you from using `<Field>` components inside your own components... provided you inject the current `record`. Also, notice that components building links require the `basePath` component, which is also injected.

## Displaying Fields depending on the user permissions

You might want to display some fields or filters only to users with specific permissions. 

Before rendering the `List`, react-admin calls the `authProvider.getPermissions()` method, and passes the result to the component as the `permissions` prop. It's up to your `authProvider` to return whatever you need to check roles and permissions inside your component.

{% raw %}
```jsx
const UserFilter = ({ permissions, ...props }) =>
    <Filter {...props}>
        <TextInput
            label="user.list.search"
            source="q"
            alwaysOn
        />
        <TextInput source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>;

export const UserList = ({ permissions, ...props }) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List
            {...props}
            filters={<UserFilter permissions={permissions} {...props} />}
            sort={{ field: 'name', order: 'ASC' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record =>
                        permissions === 'admin' ? record.role : null}
                />
            ): (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    {permissions === 'admin' && <TextField source="role" />}
                    {permissions === 'admin' && <EditButton />}
                    <ShowButton />
                </Datagrid>
            )}
        </List>;
    )
}
```
{% endraw %}

**Tip**: Note how the `permissions` prop is passed down to the custom `filters` component.

## Pagination

Here are all the props required by the <Pagination> component:

* `page`: The current page number (integer). First page is `1`.
* `perPage`: The number of records per page.
* `setPage`: `function(page: number) => void`. A function that set the current page number.
* `total`: The total number of records.
* `actions`: A component that displays the pagination buttons (default: `PaginationActions`)
* `limit`: An element that is displayed if there is no data to show (default: `<PaginationLimit>`)

You don't need to fill these props when you pass the `Pagination` component to the `List` component through the `pagination` prop: `<List pagination={<Pagination />}>`.

You can also replace the default pagination element by your own. For instance, you can modify the default pagination by adjusting the "rows per page" selector.

```jsx
// in src/MyPagination.js
import { Pagination, List } from 'react-admin';

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;

export const PostList = (props) => (
    <List {...props} pagination={<PostPagination />}>
        ...
    </List>
);
```

**Tip**: Pass an empty array to `rowsPerPageOptions` to disable the rows per page selection.

Alternately, if you want to replace the default pagination by a "<previous - next>" pagination, create a pagination component like the following:

```jsx
import Button from '@material-ui/core/Button';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Toolbar from '@material-ui/core/Toolbar';

const PostPagination = ({ page, perPage, total, setPage }) => {
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                {page > 1 &&
                    <Button color="primary" key="prev" icon={ChevronLeft} onClick={() => setPage(page - 1)}>
                        Prev
                    </Button>
                }
                {page !== nbPages &&
                    <Button color="primary" key="next" icon={ChevronRight} onClick={() => setPage(page + 1)} labelPosition="before">
                        Next
                    </Button>
                }
            </Toolbar>
    );
}

export const PostList = (props) => (
    <List {...props} pagination={<PostPagination />}>
        ...
    </List>
);
```

But if you just want to change the color property of the pagination button, you can extend the existing components:

```jsx
import {
    List,
    Pagination as RaPagination,
    PaginationActions as RaPaginationActions,
} from 'react-admin';

export const PaginationActions = props => <RaPaginationActions {...props} color="secondary" />;

export const Pagination = props => <RaPagination {...props} ActionsComponent={PaginationActions} />;

export const UserList = props => (
    <List {...props} pagination={<Pagination />}>
    </List>
);
```
