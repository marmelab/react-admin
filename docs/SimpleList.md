---
layout: default
title: "The SimpleList Component"
---

# `<SimpleList>`

<a href="./img/simple-list.gif"><img src="./img/simple-list.gif" style="height:300px" alt="The `<SimpleList>` component"></a>

For mobile devices, a `<Datagrid>` is often unusable - there is simply not enough space to display several columns. The convention in that case is to use a simple list, with only one column per row. The `<SimpleList>` component serves that purpose, leveraging [material-ui's `<List>` and `<ListItem>` components](https://v4.mui.com/components/lists/). `<SimpleList>` is an **iterator** component: it gets an array of ids and a data store from the `ListContext`, and iterates over the ids to display each record.
    
## Usage

You can use `<SimpleList>` as `<List>` or `<ReferenceManyField>` child:

```jsx
// in src/posts.js
import * as React from "react";
import { List, SimpleList } from 'react-admin';

const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});

export const PostList = (props) => (
    <List {...props}>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
            linkType={record => record.canEdit ? "edit" : "show"}
            rowStyle={postRowStyle}
        />
    </List>
);
```

For each record, `<SimpleList>` executes the `primaryText`, `secondaryText`, `linkType`, `rowStyle`, `leftAvatar`, `leftIcon`, `rightAvatar`, and `rightIcon` props functions, and creates a `<ListItem>` with the result.

The `primaryText`, `secondaryText` and `tertiaryText` functions can return a React element. This means you can use any react-admin field, including reference fields:

```jsx
// in src/posts.js
import * as React from "react";
import { List, SimpleList } from 'react-admin';

const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});

export const PostList = (props) => (
    <List {...props}>
        <SimpleList
            primaryText={<TextField source="title" />}
            secondaryText={record => `${record.views} views`}
            tertiaryText={
                <ReferenceField reference="categories" source="category_id">
                    <TextField source="name" />
                </ReferenceField>
            }
            linkType={record => record.canEdit ? "edit" : "show"}
            rowStyle={postRowStyle}
        />
    </List>
);
```

**Tip**: To use a `<SimpleList>` on small screens and a `<Datagrid>` on larger screens, use material-ui's `useMediaQuery` hook:

```jsx
// in src/posts.js
import * as React from "react";
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

**Tip**: The `<SimpleList>` items link to the edition page by default. You can also set the `linkType` prop to `show` directly to link to the `<Show>` page instead.

```jsx
// in src/posts.js
import * as React from "react";
import { List, SimpleList } from 'react-admin';

export const PostList = props => (
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

## Props

| Prop            | Required | Type                                      | Default | Description                                                                                                                                              
| --------------- | -------- | ----------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `primaryText`   | Required | `Function`                                | -       | Passed as `<ListItemText primary>` prop                                                                                                                              |
| `secondaryText` | Optional | `Function`                                | -       | Passed as `<ListItemText secondary>` prop                                                                                                                            |
| `tertiaryText`  | Optional | `Function`                                | -       | Passed as a complement to `<ListItemText primary>` with a custom style                                                                                               |
| `linkType`      | Optional | `string` &#124; `Function` &#124; `false` | `edit`  | Target of the `<ListItem>` link. Set to `false` to disable the link. Set to a function `(record, id) => string` to have the link target vary per record.             |
| `leftAvatar`    | Optional | `Function`                                | -       | When present, the `<ListItem>` renders a `<ListItemAvatar>` before the `<ListItemText>`                                                                              |
| `leftIcon`      | Optional | `Function`                                | -       | When present, the `<ListItem>` renders a `<ListIcon>` before the `<ListItemText>`                                                                                    |
| `rightAvatar`   | Optional | `Function`                                | -       | When present, the `<ListItem>` renders a `<ListItemAvatar>` after the `<ListItemText>`                                                                               |
| `rightIcon`     | Optional | `Function`                                | -       | When present, the `<ListItem>` renders a `<ListIcon>` after the `<ListItemText>`                                                                                     |
| `className`     | Optional | `string`                                  | -       | Applied to the root element                                                                                                                                          |
| `rowStyle`      | Optional | `Function`                                | -       | Applied to the `<ListItem>` styles prop. The function gets called for each row. Receives the current record and index as arguments and should return a style object. |