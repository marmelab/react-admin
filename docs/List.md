---
layout: default
title: "The List View"
---

# The List View

The List view displays a list of records fetched from the REST API. The entry point for this view is the `<List>` component, which takes care of fetching the data. Then, it passes the data to an iterator view - usually `<Datagrid>`, which then delegates the rendering of each record property to [`<Field>`](./Fields.html) components.

![The List View](./img/list-view.png)

## The `<List>` Component

The `<List>` component renders the list layout (title, buttons, filters, pagination), and fetches the list of records from the REST API. It then delegates the rendering of the list of records to its child component. Usually, it's a `<Datagrid>`, responsible for displaying a table with one row for each post.

**Tip**: In Redux terms, `<List>` is a connected component, and `<Datagrid>` is a dumb component.

Here are all the props accepted by the `<List>` component:

* [`title`](#page-title)
* [`actions`](#actions)
* [`perPage`](#records-per-page)
* [`sort`](#default-sort-field)
* [`filter`](#filters)
* [`pagination`](#pagination)

Here is the minimal code necessary to display a list of posts:

```js
// in src/App.js
import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;

// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest/lib/mui';

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

Notice that the `<List>`, `<Datagrid>`, and `<TextField>` components that we use here are from `admin-on-rest/lib/mui` - these are Material UI components.

### Page Title

The default title for a list view is "[resource] list" (e.g. "Posts list"). Use the `title` prop to customize the List view title:

```js
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

```js
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import CreateButton from '../button/CreateButton';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const PostActions = ({ resource, filter, displayedFilters, filterValues, basePath, showFilter, refresh }) => (
    <CardActions style={cardActionStyle}>
        {filter && React.cloneElement(filter, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <FlatButton primary label="refresh" onClick={refresh} icon={<NavigationRefresh />} />
        {/* Add your custom actions */}
        <FlatButton primary label="Custom Action" onClick={customAction} />
    </CardActions>
);

export const PostList = (props) => (
    <List {...props} actions={<PostActions />}>
        ...
    </List>
);
```

### Records Per Page

By default, the list paginates results by groups of 10. You can override this setting by specifying the `perPage` prop:

```js
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
```js
// in src/posts.js
export const PostList = (props) => (
    <List {...props} sort={{ field: 'published_at', order: 'DESC' }}>
        ...
    </List>
);
```
{% endraw %}

`sort` defines the *default* sort order ; the list remains sortable by clicking on column headers.

### Filters

You can add a filter element to the list using the `filters` prop:

```js
const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Title" source="title" />
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

- as a filter button (to add new filters)
- as a filter form (to enter filter values)

It does so by inspecting its `context` prop.

### Pagination

You can replace the default pagination element by your own, using the `pagination` prop. The pagination element receives the current page, the number of records per page, the total number of records, as well as a `setPage()` function that changes the page.

So if you want to replace the default pagination by a "<previous - next>" pagination, create a pagination component like the following:

```js
import FlatButton from 'material-ui/FlatButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const PostPagination = ({ page, perPage, total, setPage }) => {
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                <ToolbarGroup>
                {page > 1 &&
                    <FlatButton primary key="prev" label="Prev" icon={<ChevronLeft />} onClick={() => setPage(page - 1)} />
                }
                {page !== nbPages &&
                    <FlatButton primary key="next" label="Next" icon={<ChevronRight />} onClick={() => setPage(page + 1)} labelPosition="before" />
                }
                </ToolbarGroup>
            </Toolbar>
    );
}

export const PostList = (props) => (
    <List {...props} pagination={<PostPagination />}>
        ...
    </List>
);
```

## The `<Datagrid>` component

The datagrid component renders a list of records as a table. It is usually used as a child of the [`<List>`](#the-list-component) and [`<ReferenceManyField>`](./Fields.html#referencemanyfield) components.

Here are all the props accepted by the component:

* [`styles`](#custom-grid-style)
* [`rowStyle`](#row-style-function)

It renders as many columns as it receives `<Field>` children.

```js
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest/lib/mui';

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

The datagrid is an *iterator* component: it receives an array of ids, and a data store, and is supposed to iterate over the ids to display each record. Another example of iterator component is [`<SingleFieldList>`](#the-singlefieldlist-component).

### Custom Grid Style

You can customize the datagrid styles by passing a `styles` object as prop. The object should have the following properties:

```js
const datagridStyles = {
    table: { },
    tbody: { },
    tr: { },
    header: {
        th: { },
        'th:first-child': { }, // special style for the first header column
    },
    cell: {
        td: { },
        'td:first-child': { }, // special style for the first column
    },
};

export const PostList = (props) => (
    <List {...props}>
        <Datagrid styles={datagridStyles}>
            ...
        </Datagrid>
    </List>
);
```

**Tip**: If you want to override the `header` and `cell` styles independently for each column, use the `headerStyle` and `style` props in `<Field>` components:

{% raw %}
```js
export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField
                source="views"
                style={{ textAlign: 'right' }}
                headerStyle={{ textAlign: 'right' }}
            />
        </Datagrid>
    </List>
);
```
{% endraw %}

**Tip**: if you want to go even further and apply a custom style cell by cell, check out the [Conditional Formatting section of the Theming chapter](./Theming.html#conditional-formatting.)

### Row Style Function

You can customize the datagrid row style (applied to the `<tr>` element) based on the record, thanks to the `rowStyle` prop, which expects a function.

For instance, this allows to apply a custom background to the entire row if one value of the record - like its number of views - passes a certain threshold.

```js
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

## The `<SingleFieldList>` component

When you want to display only one property of a list of records, instead of using a `<Datagrid>`, use the `<SingleFieldList>`. It expects a single `<Field>` as child. It's especially useful for `<ReferenceManyField>` components:

```js
// Display all the books by the current author
<ReferenceManyField reference="books" target="author_id">
    <SingleFieldList>
        <ChipField source="title" />
    </SingleFieldList>
</ReferenceManyField>
```

![ReferenceManyFieldSingleFieldList](./img/reference-many-field-single-field-list.png)

## Using a Custom Iterator

A `<List>` can delegate to any iterator component - `<Datagrid>` is just one example. An iterator component must accept at least two props:

- `ids` is an array of the ids currently displayed in the list
- `data` is an object of all the fetched data for this resource, indexed by id.

For instance, what if you prefer to show a list of cards rather than a datagrid?

![Custom iterator](./img/custom-iterator.png)

Simple: Create your own iterator component as follows:

```js
// in src/comments.js
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
                subtitle={<DateField record={data[id]} source="created_at" />}
                avatar={<Avatar icon={<PersonIcon />} />}
            />
            <CardText>
                <TextField record={data[id]} source="body" />
            </CardText>
            <CardText>
                about&nbsp;
                <ReferenceField label="Post" resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath}>
                    <TextField source="title" />
                </ReferenceField>
            </CardText>
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

As you can see, nothing prevents you from using `<Field>` components inside your own components... provided you inject the current `record`. Also, notice that components building links require the `basePath` component, which is also injected.
