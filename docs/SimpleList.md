---
layout: default
title: "The SimpleList Component"
---

# `<SimpleList>`

<a href="./img/simple-list.gif"><img src="./img/simple-list.gif" style="height:300px" alt="The `<SimpleList>` component"></a>

For mobile devices, a `<Datagrid>` is often unusable - there is simply not enough space to display several columns. The convention in that case is to use a simple list, with only one column per row. The `<SimpleList>` component serves that purpose, leveraging [material-ui's `<List>` and `<ListItem>` components](https://mui.com/components/lists/). 

`<SimpleList>` is an **iterator** component: it gets an array of ids and a data store from the `ListContext`, and iterates over the ids to display each record.
    
## Usage

You can use `<SimpleList>` as `<List>` or `<ReferenceManyField>` child. You must set at least the `primaryText` prop, and it should be a function returning the text to render for each list item.

```jsx
import { List, SimpleList } from 'react-admin';

export const PostList = () => (
    <List>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
            linkType={record => record.canEdit ? "edit" : "show"}
            rowStyle={record => ({ backgroundColor: record.nb_views >= 500 ? '#efe' : 'white' })}
        />
    </List>
);
```

`<SimpleList>` executes the functions passed as `primaryText`, `secondaryText`, and `tertiaryText` on render, passing the current `record` as parameter. It uses the result to render each List item.

It accepts the following props:

* [`primaryText`](#primarytext) (required)
* [`secondaryText`](#secondarytext)
* [`tertiaryText`](#tertiarytext)
* [`linkType`](#linktype)
* [`leftAvatar`](#leftavatar)
* [`leftIcon`](#lefticon)
* [`rightAvatar`](#rightavatar)
* [`rightIcon`](#righticon)
* [`rowStyle`](#rowstyle)

## `leftAvatar`

This prop should be a function returning an `<Avatar>` component. When present, the `<ListItem>` renders a `<ListItemAvatar>` before the `<ListItemText>`

## `leftIcon`

This prop should be a function returning an `<Icon>` component. When present, the `<ListItem>` renders a `<ListIcon>` before the `<ListItemText>`

## `linkType`

The `<SimpleList>` items link to the edition page by default. You can also set the `linkType` prop to `show` directly to link to the `<Show>` page instead.

```jsx
import { List, SimpleList } from 'react-admin';

export const PostList = () => (
    <List>
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

## `primaryText`

The `primaryText`, `secondaryText` and `tertiaryText` functions can be either a function returning a string, or a React element. This means you can use any react-admin field, including reference fields:

```jsx
import { List, SimpleList } from 'react-admin';

export const PostList = () => (
    <List>
        <SimpleList
            primaryText={<TextField source="title" />}
            secondaryText={record => `${record.views} views`}
            tertiaryText={
                <ReferenceField reference="categories" source="category_id">
                    <TextField source="name" />
                </ReferenceField>
            }
        />
    </List>
);
```

`<SimpleList>` creates a `RecordContext` for each list item. This allows Field components to grab the current record using [`useRecordContext`](./useRecordContext.md).

## `rightAvatar`

This prop should be a function returning an `<Avatar>` component. When present, the `<ListItem>` renders a `<ListItemAvatar>` after the `<ListItemText>`

## `rightIcon`

This prop should be a function returning an `<Icon>` component. When present, the `<ListItem>` renders a `<ListIcon>` after the `<ListItemText>`.

## `rowStyle`

This optional prop should be a function, which gets called for each row. It receives the current record and index as arguments, and should return a style object. The style object is applied to the `<ListItem>` styles prop.

```jsx
import { List, SimpleList } from 'react-admin';

const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});

export const PostList = (props) => (
    <List {...props}>
        <SimpleList primaryText={record => record.title} rowStyle={postRowStyle} />
    </List>
);
```

## `secondaryText`

See [`primaryText`](#primarytext)

## `tertiaryText`

See [`primaryText`](#primarytext)

## Using `<SimpleList>` On Small Screens

To use `<SimpleList>` on small screens and a `<Datagrid>` on larger screens, use material-ui's `useMediaQuery` hook:

```jsx
import { useMediaQuery } from '@mui/material';
import { List, SimpleList, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export const PostList = props => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List {...props}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                    linkType={record => record.canEdit ? "edit" : "show"}   
                />
            ) : (
                <Datagrid>
                    //...
                </Datagrid>
            )}
        </List>
    );
}
```
