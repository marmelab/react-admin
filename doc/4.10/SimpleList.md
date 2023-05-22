---
layout: default
title: "The SimpleList Component"
---

# `<SimpleList>`

<video controls autoplay playsinline muted loop style="height:300px">
    <source src="./img/simple-list.webm" type="video/webm"/>
    <source src="./img/simple-list.mp4" type="video/mp4"/>
    Your browser does not support the video tag.
</video>

For mobile devices, a `<Datagrid>` is often unusable - there is simply not enough space to display several columns. The convention in that case is to use a simple list, with only one column per row. The `<SimpleList>` component serves that purpose, leveraging [Material UI's `<List>` and `<ListItem>` components](https://mui.com/components/lists/). 

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
* [`empty`](#empty)

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


`linkType` accepts the following values:

* `linkType="edit"`: links to the edit page. This is the default behavior.
* `linkType="show"`: links to the show page.
* `linkType={false}`: does not create any link.



## `primaryText`

The `primaryText`, `secondaryText` and `tertiaryText` props can accept 3 types of values:

1. a function returning a string, 
2. a string, 
3. a React element. 

If it's a **function**, react-admin passes the current record as parameter:

```jsx
import { List, SimpleList } from 'react-admin';

export const PostList = () => (
    <List>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
        />
    </List>
);
```

If it's a **string**, react-admin passes it to [the `translate` function](./useTranslate.md), together with the `record` so you can use substitutions with the `%{token}` syntax:

```jsx
import { List, SimpleList } from 'react-admin';

export const PostList = () => (
    <List>
        <SimpleList
            primaryText="%{title}"
            secondaryText="%{views} views"
        />
    </List>
);
```

If it's a **React element**, react-admin renders it. This means you can use any react-admin field, including reference fields:

```jsx
import {
    List,
    ReferenceField,
    SimpleList,
    TextField,
} from 'react-admin';

export const PostList = () => (
    <List>
        <SimpleList
            primaryText={<TextField source="title" />}
            secondaryText={
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

export const PostList = () => (
    <List>
        <SimpleList primaryText={record => record.title} rowStyle={postRowStyle} />
    </List>
);
```

## `secondaryText`

See [`primaryText`](#primarytext)

## `tertiaryText`

See [`primaryText`](#primarytext)

## `empty`

It's possible that a SimpleList will have no records to display. If the SimpleList's parent component does not handle the empty state, the SimpleList will display a message indicating there are no results. This message is translatable and its key is `ra.navigation.no_results`.

You can customize the empty state by passing  a component to the `empty` prop:

```jsx
const CustomEmpty = () => <div>No books found</div>;

const PostList = () => (
    <List>
        <SimpleList
            primaryText={record => record.title}
            empty={<CustomEmpty />}
        />
    </List>
);
```

## Using `<SimpleList>` On Small Screens

To use `<SimpleList>` on small screens and a `<Datagrid>` on larger screens, use Material UI's `useMediaQuery` hook:

```jsx
import { useMediaQuery } from '@mui/material';
import { List, SimpleList, Datagrid } from 'react-admin';

export const PostList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <List>
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

## Configurable

You can let end users customize the fields displayed in the `<SimpleList>` by using the `<SimpleListConfigurable>` component instead.

<video controls autoplay playsinline muted loop>
  <source src="./img/SimpleListConfigurable.webm" type="video/webm"/>
  <source src="./img/SimpleListConfigurable.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


```diff
import {
    List,
-   SimpleList,
+   SimpleListConfigurable,
} from 'react-admin';

export const BookList = () => (
    <List>
-       <SimpleList
+       <SimpleListConfigurable
            primaryText={record => record.title}
            secondaryText={record => record.author}
            tertiaryText={record => record.date}
        />
    </List>
);
```

When users enter the configuration mode and select the `<SimpleList>`, they can set the `primaryText`, `secondaryText`, and `tertiaryText` fields via the inspector. `<SimpleList>` uses [the `useTranslate` hook](./useTranslate.md) to render the fields. The `translate` function receives the current record as parameter. This means users can access the record field using the `%{field}` syntax, e.g.:

```
Title: %{title} (by %{author})
```

